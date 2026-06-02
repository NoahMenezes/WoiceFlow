import sys
import socket

def main() -> None:
    """Sends a toggle message to the running WoiceFlow daemon over a Unix socket."""
    socket_path = "/run/user/1000/woiceflow.socket"
    try:
        client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        client.connect(socket_path)
        client.sendall(b"toggle")
        client.close()
        print("WoiceFlow toggle command sent successfully.")
    except Exception as e:
        print(
            f"Error: Could not connect to WoiceFlow daemon. "
            f"Is it running? (Socket error: {e})",
            file=sys.stderr
        )
        sys.exit(1)

if __name__ == "__main__":
    main()
