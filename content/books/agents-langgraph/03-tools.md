---
title: Tools and structured outputs
description: Letting the model call functions, and getting back data you can actually use.
order: 3
---

Tools are how an agent affects the outside world. Database queries, API calls, file reads, calculations - anything the model cannot do inside its own weights. In LangGraph, a tool is a Python function with a schema the LLM can see.

## Defining a tool

```python
from langchain_core.tools import tool

@tool
def lookup_user(user_id: str) -> dict:
    """Look up a user by ID. Returns name, email, and account status."""
    row = db.query("SELECT * FROM users WHERE id = ?", user_id)
    return {"name": row.name, "email": row.email, "status": row.status}
```

The decorator extracts the function name, type hints, and docstring into a JSON schema the LLM uses to understand what the tool does and how to call it. Three things matter here:

- **Docstring quality.** The model reads the docstring to decide when to call the tool. Vague docstring, wrong tool selection. Spell out what the tool does, what the arguments mean, and what the return value looks like.
- **Type hints.** The schema is only as good as your types. `user_id: str` is fine; `user_id` with no hint is useless.
- **Return a structured value.** Dicts, Pydantic models, or primitives. Not giant strings the model has to parse.

## Binding tools to the LLM

The LLM needs to know which tools exist. Bind them when you create the model instance:

```python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o").bind_tools([lookup_user, send_email, check_inventory])
```

Now when the LLM is called, each response can include a `tool_calls` field: a list of (tool_name, arguments) pairs the model wants you to execute.

## The agent loop with ToolNode

LangGraph provides a prebuilt `ToolNode` that executes tool calls and appends the results to the message history:

```python
from langgraph.prebuilt import ToolNode

tools_node = ToolNode([lookup_user, send_email, check_inventory])

def should_continue(state: AgentState) -> str:
    last = state["messages"][-1]
    if last.tool_calls:
        return "tools"
    return END

graph.add_node("llm", call_model)
graph.add_node("tools", tools_node)
graph.add_edge("tools", "llm")
graph.add_conditional_edges("llm", should_continue)
graph.set_entry_point("llm")
```

The loop: LLM speaks. If it asks for a tool, run the tool, append the result, loop back to the LLM. If it does not ask for a tool, we are done. Classic ReAct with explicit state.

## Structured outputs instead of free-form answers

When the final answer needs to be data, not prose, use structured outputs:

```python
from pydantic import BaseModel

class LeaveDecision(BaseModel):
    approved: bool
    reason: str
    valid_until: str | None

llm_structured = llm.with_structured_output(LeaveDecision)
result: LeaveDecision = llm_structured.invoke(messages)
```

The model is now constrained to produce a response matching that schema. Downstream code can rely on the shape rather than parsing freeform text with regexes. For anything that feeds into another system - an API call, a database insert, a template email - structured outputs are what you want.

## Tool design principles

A few patterns worth internalizing:

- **One tool, one job.** `get_user_by_id` and `search_users_by_name` are two tools, not one `lookup_user` with branching behavior. The model picks correct tools more reliably when each tool does one thing.
- **Validate on the way in.** The LLM will occasionally pass garbage arguments. Pydantic validation at the tool boundary catches it before the tool runs. Return a clear error message the model can respond to.
- **Keep tool output small.** The result goes back into the model's context. A tool that returns 10,000 tokens of JSON eats your context window. Summarize or paginate at the tool level.
- **Make tools idempotent where possible.** The agent will sometimes retry. Non-idempotent side effects (sending emails, charging cards) need deduplication keys.

Good tool design is the difference between an agent that solves problems and one that spins in circles calling the wrong function.
