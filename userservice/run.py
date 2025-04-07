from app import create_app
from app.nacos.client import start_nacos_registration

app = create_app()

if __name__ == "__main__":
    start_nacos_registration()
    app.run(host="0.0.0.0", port=7000, debug=True)
