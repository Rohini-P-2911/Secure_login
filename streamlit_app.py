
import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="Secure Real Estate Login",
    page_icon="🏡",
    layout="wide"
)

st.title("🏡 Secure Real Estate Login")

# Read the existing HTML file
html_path = Path("index.html")

if html_path.exists():
    html_content = html_path.read_text(encoding="utf-8")

    # Embed the website in Streamlit
    components.html(
        html_content,
        height=900,
        scrolling=True
    )
else:
    st.error(
        "index.html file not found. "
        "Please upload index.html to your GitHub repository."
    )
