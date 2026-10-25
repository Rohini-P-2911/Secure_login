import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Secure Real Estate Login",
    page_icon="🏡",
    layout="wide"
)

base_path = Path(__file__).parent

html_path = base_path / "index.html"
css_path = base_path / "style.css"
js_path = base_path / "script.js"

if html_path.exists() and css_path.exists() and js_path.exists():

    html_content = html_path.read_text(encoding="utf-8")
    css_content = css_path.read_text(encoding="utf-8")
    js_content = js_path.read_text(encoding="utf-8")

    html_content = html_content.replace(
        '<link rel="stylesheet" href="style.css">',
        '<style>\n' + css_content + '\n</style>'
    )

    html_content = html_content.replace(
        '<script src="script.js" defer></script>',
        '<script>\n' + js_content + '\n</script>'
    )

    components.html(
        html_content,
        height=1200,
        scrolling=True
    )

else:
    st.error(
        "Please keep index.html, style.css, and script.js "
        "in the same folder as streamlit_app.py."
    )
