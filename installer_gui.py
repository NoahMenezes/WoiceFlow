#!/usr/bin/env python3
import os
import sys
import time
import subprocess
import shutil
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TimeElapsedColumn
from rich.live import Live
from rich.align import Align

console = Console()

def print_banner():
    banner = Text()
    banner.append("\n", style="bold")
    banner.append("█▀▀ █  █ █▀▀▀█ ▀▀█▀▀ █▀▀▀█ █ █▀▀▀█ █▀▀▀█ █   █▀▀▀█ █ █   █\n", style="bold bright_magenta")
    banner.append("█ ▀ █  █ █   █   █   █   █ █ █ ▀ █ █   █ █ █ █   █ █ █   █\n", style="bold bright_yellow")
    banner.append("█   █▄▄█ █▄▄▄█   █   █▄▄▄█ █ █▄▄▄█ █▄▄▄█ █▄█ █▄▄▄█ █ █▄▄▄█\n", style="bold bright_cyan")
    banner.append("                                                 █\n", style="bold bright_green")
    
    panel = Panel(
        Align.center(banner),
        subtitle="[bold bright_yellow]⚡ Linux Installer v1.0.0 ⚡[/bold bright_yellow]",
        title="[bold bright_cyan]🎙️  WoiceFlow Dictation Suite[/bold bright_cyan]",
        border_style="bright_magenta",
        padding=(0, 2)
    )
    console.print(panel)
    console.print()

def main():
    if len(sys.argv) < 2:
        console.print("[bold bright_red]Error: Installation directory argument missing.[/bold bright_red]")
        sys.exit(1)

    install_dir = sys.argv[1]
    systemd_user_dir = os.path.expanduser("~/.config/systemd/user")
    service_name = "woiceflow"

    print_banner()

    steps = [
        ("Creating directory layout", 10),
        ("Writing setup environment config (.env)", 10),
        ("Building python startup wrapper (woiceflow.sh)", 15),
        ("Generating systemd user service manifest", 20),
        ("Reloading systemd daemon & environment", 20),
        ("Starting WoiceFlow user-level service daemon", 25)
    ]

    with Progress(
        SpinnerColumn("dots12", style="bright_yellow"),
        TextColumn("[bold bright_cyan]{task.description}"),
        BarColumn(bar_width=40, style="dim", complete_style="bright_magenta", finished_style="bold bright_green"),
        TextColumn("[bold bright_yellow]{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        console=console
    ) as progress:
        overall_task = progress.add_task("[bold bright_white]Running installation pipeline...[/bold bright_white]", total=100)

        # 1. Creating layout
        progress.update(overall_task, description="Creating directory layout...")
        os.makedirs(install_dir, exist_ok=True)
        time.sleep(0.3)
        progress.advance(overall_task, 10)

        # 2. Writing .env
        progress.update(overall_task, description="Writing setup environment config (.env)...")
        env_path = os.path.join(install_dir, ".env")
        if not os.path.exists(env_path):
            with open(env_path, "w") as f:
                f.write("HF_TOKEN=\nWOICEFLOW_MODEL_SIZE=base\nWOICEFLOW_DEVICE=cpu\nWOICEFLOW_COMPUTE_TYPE=int8\n")
        time.sleep(0.3)
        progress.advance(overall_task, 10)

        # 3. Startup wrapper
        progress.update(overall_task, description="Building python startup wrapper (woiceflow.sh)...")
        wrapper_path = os.path.join(install_dir, "woiceflow.sh")
        log_file = os.path.join(install_dir, "woiceflow.log")
        
        wrapper_content = f"""#!/bin/bash
# WoiceFlow startup wrapper
# Waits for the graphical session to fully initialize, then launches the app.

sleep 5

DIR="$( cd "$( dirname "${{BASH_SOURCE[0]}}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Activate the virtual environment
source .venv/bin/activate

# Log output to a file for easy debugging
LOG_FILE="{log_file}"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date)] WoiceFlow starting..." >> "$LOG_FILE"
exec python main.py >> "$LOG_FILE" 2>&1
"""
        with open(wrapper_path, "w") as f:
            f.write(wrapper_content)
        os.chmod(wrapper_path, 0o755)
        time.sleep(0.3)
        progress.advance(overall_task, 15)

        # 4. Systemd service or autostart
        has_systemd = shutil.which("systemctl") is not None
        if has_systemd:
            progress.update(overall_task, description="Generating systemd user service manifest...")
            os.makedirs(systemd_user_dir, exist_ok=True)
            service_path = os.path.join(systemd_user_dir, f"{service_name}.service")
            
            service_content = f"""[Unit]
Description=WoiceFlow Voice Dictation
Documentation=https://github.com/NoahMenezes/WoiceFlow
After=graphical-session.target
Wants=graphical-session.target

[Service]
Type=simple
ExecStart={wrapper_path}
Restart=on-failure
RestartSec=5s
Environment=DISPLAY=:0
PassEnvironment=DISPLAY WAYLAND_DISPLAY XDG_RUNTIME_DIR DBUS_SESSION_BUS_ADDRESS
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
"""
            with open(service_path, "w") as f:
                f.write(service_content)
            progress.advance(overall_task, 20)

            # 5. Reloading systemd
            progress.update(overall_task, description="Reloading systemd daemon & environment...")
            subprocess.run(["systemctl", "--user", "daemon-reload"], check=False)
            subprocess.run(["systemctl", "--user", "import-environment", "DISPLAY", "WAYLAND_DISPLAY", "XDG_RUNTIME_DIR", "DBUS_SESSION_BUS_ADDRESS"], check=False)
            progress.advance(overall_task, 20)

            # 6. Starting daemon
            progress.update(overall_task, description="Starting WoiceFlow user-level service daemon...")
            subprocess.run(["systemctl", "--user", "enable", f"{service_name}.service"], check=False)
            subprocess.run(["systemctl", "--user", "restart", f"{service_name}.service"], check=False)
            progress.advance(overall_task, 25)
        else:
            # Fallback to XDG Autostart
            progress.update(overall_task, description="Generating XDG autostart file...")
            autostart_dir = os.path.expanduser("~/.config/autostart")
            os.makedirs(autostart_dir, exist_ok=True)
            desktop_path = os.path.join(autostart_dir, "woiceflow.desktop")
            desktop_content = f"""[Desktop Entry]
Type=Application
Name=WoiceFlow
Comment=Voice Dictation Tool
Exec={wrapper_path}
Icon=microphone-sensitivity-high-symbolic
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
"""
            with open(desktop_path, "w") as f:
                f.write(desktop_content)
            progress.advance(overall_task, 20)
            progress.update(overall_task, description="Launching WoiceFlow in the background...")
            subprocess.Popen([wrapper_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            progress.advance(overall_task, 45)

        progress.update(overall_task, description="[bold bright_green]Installation complete![/bold bright_green]")
        time.sleep(0.5)

    console.print()

    # Success Table
    summary_table = Table(title="[bold bright_magenta]✨ WoiceFlow Installation Summary ✨[/bold bright_magenta]", border_style="bright_cyan")
    summary_table.add_column("Property", style="bold bright_yellow", no_wrap=True)
    summary_table.add_column("Status / Path", style="bold bright_white")

    summary_table.add_row("Install Location", f"[bold bright_green]{install_dir}[/bold bright_green]")
    summary_table.add_row("Execution Mode", "[bold bright_cyan]Wayland (ydotool Supported) 🚀[/bold bright_cyan]" if shutil.which("ydotool") else "[bold bright_yellow]X11 (pynput Mode) 🖥️[/bold bright_yellow]")
    summary_table.add_row("Service Status", "[bold bright_green]Active (Running) 🟢[/bold bright_green]" if has_systemd else "[bold bright_yellow]XDG Background Loop 🔄[/bold bright_yellow]")
    summary_table.add_row("Configuration File", f"[bold bright_magenta]{os.path.join(install_dir, '.env')}[/bold bright_magenta]")

    console.print(summary_table)
    console.print()

    # CLI command helper Panel
    commands_text = Text()
    commands_text.append("Here are some useful commands you can use to control the app:\n\n", style="bold bright_white")
    if has_systemd:
        commands_text.append("  🔍 View Live Logs:   ", style="bold bright_green")
        commands_text.append("journalctl --user -u woiceflow -f\n", style="bold bright_yellow")
        commands_text.append("  ⚙️  Check Status:     ", style="bold bright_green")
        commands_text.append("systemctl --user status woiceflow\n", style="bold bright_yellow")
        commands_text.append("  🔄 Restart Service:   ", style="bold bright_green")
        commands_text.append("systemctl --user restart woiceflow\n", style="bold bright_yellow")
        commands_text.append("  🛑 Stop Service:      ", style="bold bright_green")
        commands_text.append("systemctl --user stop woiceflow\n", style="bold bright_yellow")
    else:
        commands_text.append("  🔍 View Logs:         ", style="bold bright_green")
        commands_text.append(f"cat {log_file}\n", style="bold bright_yellow")
        commands_text.append("  ▶️  Run Manually:      ", style="bold bright_green")
        commands_text.append(f"{wrapper_path}\n", style="bold bright_yellow")

    commands_panel = Panel(
        commands_text,
        title="[bold bright_yellow]📋 Management Commands[/bold bright_yellow]",
        border_style="bright_green",
        padding=(1, 2)
    )
    console.print(commands_panel)
    console.print()

    console.print("[bold bright_green]🎉 Success! WoiceFlow is active and listening. Press [bold bright_yellow]F9[/bold bright_yellow] globally to toggle recording! 🎉[/bold bright_green]\n")

if __name__ == "__main__":
    main()
