from flask import Flask, render_template, request, jsonify
from chat import get_response

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("./index.html")
@app.route("/about")
def about():
    return render_template("./about.html")
@app.route("/services")
def services():
    return render_template("./services.html")
@app.route("/contact")
def contact():
    return render_template("./contact.html")

@app.route("/predict", methods=["POST"])
def predict():

    text = request.get_json().get("message")

    response = get_response(text)

    message = {"answer": response}

    return jsonify(message)

if __name__ == "__main__":
    app.run(debug=True)