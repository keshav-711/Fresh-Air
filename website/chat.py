import random,json,torch
from model import ffnn
from brain import bag_of_words,tokenize
if torch.cuda.is_available():
    device=torch.device("cuda")
else:
    device=torch.device("cpu")
with open("dataset.json","r") as f:
    intents=json.load(f)
FILE="data.pth"
data=torch.load(FILE)
input_size=data["input_size"]
hidden_size=data["hidden_size"]
output_size=data["output_size"]
all_words=data["all_words"]
tags=data["tags"]
model_state=data["model_state"]
model=ffnn(input_size,hidden_size,output_size).to(device)
model.load_state_dict(model_state)
model.eval()

def get_response(sentence):
    sentence = tokenize(sentence)
    x=bag_of_words(sentence,all_words)
    x=x.reshape(1,x.shape[0])
    x=torch.from_numpy(x)
    x = x.to(device)
    output=model(x)
    _, predicted=torch.max(output,dim=1)
    tag=tags[predicted.item()]
    probabilities=torch.softmax(output,dim=1)
    probability=probabilities[0][predicted.item()]

    if probability.item()>0.75:
        for intent in intents["intents"]:
            if tag==intent["tag"]:
                return random.choice(intent['responses'])
    else:
        return  "sorry I am unable to understand...!!!"