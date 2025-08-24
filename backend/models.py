from datetime import datetime
import json
from typing import Any, Dict, List, Optional
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

# Fix: Use str, Enum instead of Enum alone
class AttemptStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

class GuideStatus(str, Enum):
    PROCESSING = "processing"
    READY = "ready"
    ERROR = "error"

class OpenAPISpec(SQLModel, table=True):
    '''Stores uploaded OpenAPI/Swagger specifications'''
    __tablename__ = "openapi_specs"

    #Id Field
    id: Optional[int] = Field(default=None, primary_key=True)
    # metadata fields
    title:str = Field(max_length=200)
    version:str = Field(max_length=50, default="1.0.0")
    description: Optional[str] = Field(default=None, max_length=1000)

    # The actual OpenAPI specification Stores the entire OpenAPI JSON as a text string
    spec_json: str = Field()

    # Timestamp Tracking
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def spec_data(self) -> Dict[str, Any]:
        """Parse the JSON spec data into a Python dictionary. Convert JSON string back to Python dict for easy access"""
        return json.loads(self.spec_json)
    @spec_data.setter
    def spec_data(self, value: Dict[str, Any]) -> None:
        """Set spec data from a Python dictionary. Accept Python dict and automatically convert to JSON string"""
        self.spec_json = json.dumps(value)

    # Relationships - connects to other tables
    #List["TutorialGuide"] - This spec can have multiple tutorial guides
    guides: list["TutorialGuide"] = Relationship(back_populates="spec")

class TutorialGuide(SQLModel, table=True):
    """Generated tutorial guides from OpenAPI specs."""
    __tablename__= "tutorial_guides"

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    spec_id: int = Field(foreign_key="openapi_specs.id")
    # - Human-readable tutorial name
    title: str = Field(max_length=200)
    #  What the user will learn
    description: str = Field()
    
    status: GuideStatus = Field(default=GuideStatus.PROCESSING)
    # Where to send test requests. Each tutorial gets its own mock API sandbox
    sandbox_base_url: Optional[str] = Field(default=None, max_length=500)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    # OpenAPISpec - Back-reference to parent spec
    spec: OpenAPISpec = Relationship(back_populates="guides")
    # One-to-Many: One guide has 4-6 tutorial steps
    # Example: Step 1: Auth, Step 2: GET /pets, Step 3: POST /pets
    steps: list["TutorialStep"] = Relationship(back_populates="guide")
    # All user attempts for this tutorial
    # Track how many people tried this tutorial and where they struggled
    attempts: list["StepAttempt"] = Relationship(back_populates="guide")

class TutorialStep(SQLModel, table=True):
    """Individual step in a tutorial guide"""
    __tablename__ = "tutorial_steps"

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Key - which guide this step belongs to
    guide_id: int = Field(foreign_key="tutorial_guides.id")

    step_number: int = Field()
    title: str = Field(max_length=200)  # "Get Auth Token"
    description: str = Field()  # Longer explanation of this step
    method: str = Field(max_length=10)  # HTTP method: GET, POST, etc.
    endpoint: str = Field(max_length=200)  # API endpoint: /pets, /pets/{id}
    request_example: Optional[str] = Field(default=None)  # Example request payload
    expected_status: int = Field(default=200)  # Expected HTTP status code
    required_fields: str = Field(default="[]")  # FIXED: Added str type and proper syntax
    spec_citation: str = Field()  # Which part of the OpenAPI spec this step covers

    @property
    def required_fields_list(self) -> List[str]:  # FIXED: Proper type hint
        """Get required fields as a Python list"""
        return json.loads(self.required_fields)
    
    @required_fields_list.setter
    def required_fields_list(self, value: List[str]) -> None:
        """Set required fields from a Python list"""
        self.required_fields = json.dumps(value)
    #  Back-reference to parent tutorial
    guide: TutorialGuide = Relationship(back_populates="steps")
    #  All user attempts for this specific step. Usage: Track how many people struggled with "Step 2: List pets"
    attempts: List["StepAttempt"] = Relationship(back_populates="step")

class StepAttempt(SQLModel, table=True):
    """Usrer attempt at a tutorial step"""
    __tablename__ = "step_attempts"
   
    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)
    # Foreign Keys
    guide_id: int = Field(foreign_key="tutorial_guides.id")
    step_id: int = Field(foreign_key="tutorial_steps.id")

    session_id: str = Field(max_length=100)  # Track browser sessions

    request_url: str = Field(max_length=1000)  # Full URL user called
    request_method: str = Field(max_length=10)  # HTTP method used
    request_headers: str = Field(default="{}")  # CORRECT - empty JSON string
        # What the API actually returned
    response_status: Optional[int] = Field(default=None)
    response_body: Optional[str] = Field(default=None)  # JSON string of response
    
    # Validation results (deterministic, no AI)
    status: AttemptStatus = Field(default=AttemptStatus.PENDING)
    validation_message: Optional[str] = Field(default=None, max_length=1000)
    
    # AI explanation (only for explaining, not for pass/fail decisions)
    ai_explanation: Optional[str] = Field(default=None)
    
    # Timestamp
    attempted_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def request_headers_dict(self) -> Dict[str, str]:
        """Get request headers as dictionary."""
        return json.loads(self.request_headers)
    
    @request_headers_dict.setter
    def request_headers_dict(self, value: Dict[str, str]) -> None:
        """Set request headers from dictionary."""
        self.request_headers = json.dumps(value)
    
    # Relationships
    guide: TutorialGuide = Relationship(back_populates="attempts")
    step: TutorialStep = Relationship(back_populates="attempts")