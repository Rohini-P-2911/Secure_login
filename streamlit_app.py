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
        ''
    )

    html_content = html_content.replace(
        '</body>',
        '<script>\n' + js_content + '\n</script>\n</body>'
    )

    components.html(
        html_content,
        height=1200,
        scrolling=True
    )

else:
    st.error("Check that all three files are in the same folder.")
