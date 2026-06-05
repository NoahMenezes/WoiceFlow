# -*- mode: python ; coding: utf-8 -*-
import os
import sys
from PyInstaller.utils.hooks import collect_all

# Ensure the 'src' directory is in python search path
sys.path.insert(0, os.path.abspath('src'))

# Collect dynamic libraries, data files, and hidden imports for heavy/complex dependencies
fw_datas, fw_binaries, fw_hiddenimports = collect_all('faster_whisper')
ct_datas, ct_binaries, ct_hiddenimports = collect_all('ctranslate2')
sd_datas, sd_binaries, sd_hiddenimports = collect_all('sounddevice')
pn_datas, pn_binaries, pn_hiddenimports = collect_all('pynput')
wf_datas, wf_binaries, wf_hiddenimports = collect_all('woiceflow')

all_datas = fw_datas + ct_datas + sd_datas + pn_datas + wf_datas
all_binaries = fw_binaries + ct_binaries + sd_binaries + pn_binaries + wf_binaries
all_hiddenimports = fw_hiddenimports + ct_hiddenimports + sd_hiddenimports + pn_hiddenimports + wf_hiddenimports

a = Analysis(
    ['main.py'],
    pathex=['src'],
    binaries=all_binaries,
    datas=all_datas,
    hiddenimports=all_hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='WoiceFlow',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='WoiceFlow',
)
