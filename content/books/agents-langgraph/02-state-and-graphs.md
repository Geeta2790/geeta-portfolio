---
title: State and graphs
description: Defining typed state, building nodes, and routing with conditional edges.
order: 2
---

LangGraph's core abstraction is a `StateGraph`. You define a state type, you add nodes (functions that read state and return updates), and you connect them with edges (which can be conditional). The graph compiles into an executable pipeline you call like a function.

## Define state explicitly

Do not use a free-form dictionary. Use a `TypedDict` or Pydantic model so every node knows exactly what fields are available.

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_intent: str | None
    retrieved_docs: list[str]
    draft_answer: str | None
    needs_human_review: bool
```

Explicit state is the foundation for everything else:

- You can serialize it, checkpoint it, inspect it, replay it.
- Nodes have a type-checked contract about what they can read and write.
- When you add a new field three months in, you do not have to grep for every place that touches the state dict.

The `Annotated[list, add_messages]` tells LangGraph to merge new messages into the existing list rather than overwriting - this is how multi-turn conversation history accumulates.

## Nodes are functions

A node is a function that takes state and returns a partial state update:

```python
def classify_intent(state: AgentState) -> dict:
    last_message = state["messages"][-1].content
    intent = llm_classify(last_message)
    return {"user_intent": intent}
```

Return only the fields you are updating. LangGraph merges them into the full state. This keeps nodes focused and makes them easy to test - give the function a state dict, assert the returned update.

## Edges connect nodes

Edges can be static or conditional:

```python
from langgraph.graph import StateGraph, END

graph = StateGraph(AgentState)
graph.add_node("classify", classify_intent)
graph.add_node("retrieve", retrieve_docs)
graph.add_node("generate", generate_answer)
graph.add_node("escalate", escalate_to_human)

graph.set_entry_point("classify")

def route_after_classify(state: AgentState) -> str:
    if state["user_intent"] == "out_of_scope":
        return "escalate"
    return "retrieve"

graph.add_conditional_edges("classify", route_after_classify)
graph.add_edge("retrieve", "generate")
graph.add_edge("generate", END)
graph.add_edge("escalate", END)

app = graph.compile()
```

Three things worth noting:

- `END` is a special sink. Any edge to `END` terminates execution for that branch.
- Conditional edges return the name of the next node based on state. Keep the routing function pure - no side effects, no LLM calls. Routing is control flow, not business logic.
- Nodes can loop. An edge from `generate` back to `retrieve` is legal and useful for self-correcting agents.

## Running the graph

Compiled graphs expose `invoke`, `stream`, and `ainvoke`:

```python
result = app.invoke({"messages": [HumanMessage("What is leave encashment?")]})
```

`invoke` returns the final state. `stream` yields state updates after each node, which is what you want for showing progress in a UI. `ainvoke` is the async version.

## Design the graph before you code

The best agents I have built started as a hand-drawn diagram. Nodes with names, arrows between them, decision points labeled. Then I translated that into LangGraph. The code is a direct expression of the diagram.

If you cannot draw the agent as a graph on a whiteboard, you do not understand the agent yet. The code will be a mess that reflects the lack of design. Draw first, code second.
