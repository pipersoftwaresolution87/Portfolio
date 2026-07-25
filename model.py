from pydantic import BaseModel, Field
from typing import Optional, Union

class UserQuery(BaseModel):
    name: str = Field(..., max_length=50, description="Name of the user")
    email: str = Field(..., max_length=50, description="Email of the user")
    objective: Union[str, list[str]] = Field(..., description="Primary objective or list of objectives")
    monthly_budget: Union[str, list[str]] = Field(..., description="Monthly budget range")
    details: Optional[str] = Field(None, description="System challenges or scope details")
