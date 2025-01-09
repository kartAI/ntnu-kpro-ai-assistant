from IPython.display import Image
from langgraph.graph import StateGraph

SAVE_PATH = "graph.png"


def visualize(graph: StateGraph) -> None:
    Image(graph.get_graph().draw_mermaid_png()).save(SAVE_PATH)
