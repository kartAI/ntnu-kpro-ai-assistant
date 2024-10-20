from IPython.display import Image, display

SAVE_PATH = "graph.png"


def visualize(graph):
    Image(graph.get_graph().draw_mermaid_png()).save(SAVE_PATH)
