
import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Secure Real Estate Login",
    page_icon="🏡",
    layout="wide"
)

# Read all website files
base_path = Path(__file__).parent

html_path = base_path / "index.html"
css_path = base_path / "style.css"
js_path = base_path / "script.js"

if html_path.exists() and css_path.exists() and js_path.exists():

    html_content = html_path.read_text(encoding="utf-8")
    css_content = css_path.read_text(encoding="utf-8")
    js_content = js_path.read_text(encoding="utf-8")

    # Add CSS and JavaScript directly into HTML
    html_content = html_content.replace(
        '<link rel="stylesheet" href="style.css">',
        f"<style>{css_content}</style>"
    )

    html_content = html_content.replace(
        '<script src="script.js" defer></script>',
        f"<script>{js_content}</script>"
    )

    components.html(
        html_content,
        height=1100,
        scrolling=True
    )

else:
    st.error(
        "Please check that index.html, style.css, "
        "and script.js are in the same repository folder."
    )
