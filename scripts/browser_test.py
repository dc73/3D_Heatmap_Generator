from pathlib import Path
from playwright.sync_api import sync_playwright
import struct
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=str(Path.home()/'Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'))
    page=browser.new_page(viewport={'width':1400,'height':1050},accept_downloads=True)
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    page.goto((root/'release/Heatmap Studio.html').as_uri())
    page.wait_for_load_state('networkidle')
    assert page.locator('#chart svg').count()==1
    page.locator('#csv-file').set_input_files('/Users/dheerchhabria/Downloads/Attendance by Hour by Day of Week - Report.csv')
    page.wait_for_function("document.getElementById('total').textContent === '524'")
    assert page.locator('#chart polygon').count()==234
    original=page.locator('#chart').inner_html()
    page.locator('#rotation').fill('180')
    assert original!=page.locator('#chart').inner_html()
    page.locator('#palette').select_option('blue')
    assert '#155b99' in page.locator('#chart').inner_html()
    page.locator('#custom-color').fill('#224466')
    assert page.locator('#palette').input_value()=='custom'
    page.locator('#rotation').fill('45')
    page.locator('#palette').select_option('red')
    with page.expect_download() as dl:
        page.locator('#download-svg').click()
    dl.value.save_as('/tmp/aac-heatmap-export.svg')
    svg=Path('/tmp/aac-heatmap-export.svg').read_text()
    ET.fromstring(svg)
    assert '<polygon' in svg and 'Academic Advancement Center' in svg and 'data:image/png;base64,' in svg
    with page.expect_download(timeout=30000) as dl:
        page.locator('#download').click()
    dl.value.save_as('/tmp/aac-heatmap-export.png')
    png=Path('/tmp/aac-heatmap-export.png').read_bytes()
    assert struct.unpack('>II',png[16:24])==(4800,3320)
    page.screenshot(path='/tmp/aac-heatmap-preview.png',full_page=True)
    page.locator('#flat').click()
    assert page.locator('#chart polygon').count()==0
    assert '9am' in page.locator('#chart').inner_text()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
    assert errors==[],errors
    browser.close()
    print('PASS: offline CSV import, totals, rotation, palettes, SVG export, 4800px PNG export, 2D labels, mobile layout; no browser errors')
