import json
import numpy as np
from brain import tokenize,stem_lower,bag_of_words
import torch
import torch.nn as nn
from torch.utils.data import Dataset,DataLoader
from model import ffnn

with open("dataset.json","r") as f:
    intents=json.load(f)

all_words_x=[]
tags_y=[]
xy=[]

for intent in intents["intents"]:
    tag=intent["tag"]
    tags_y.append(tag)
    for pattern in intent["patterns"]:
        w=tokenize(pattern)
        all_words_x.extend(w)
        xy.append((w,tag))

ignore_punctuation = [
    ".", ",", "!", "?", ";", ":", "'", '"',
    "(", ")", "[", "]", "{", "}",
    "-", "_", "/", "\\", "|",
    "@", "#", "$", "%", "^", "&", "*",
    "+", "=", "<", ">", "~", "`"
]

stem=stem_lower(all_words_x)

stem = [w for w in stem if w not in ignore_punctuation]

all_words=sorted(set(stem))
all_tags=sorted(set(tags_y))


x_train=[]
y_train=[]
for (pattern_sentence,tag) in xy:
    bag=bag_of_words(pattern_sentence,all_words)
    x_train.append(bag)

    labels=all_tags.index(tag)
    y_train.append(labels)

x_train=np.array(x_train)
y_train=np.array(y_train)

class chatdataset(Dataset):
    def __init__(self):
        self.n_sampels=len(x_train)
        self.x_data=x_train
        self.y_data=y_train

    def __getitem__(self, idx):
        return self.x_data[idx],self.y_data[idx]
    
    def __len__(self):
        return self.n_sampels
    
batch_size=8
dataset=chatdataset()
loader=DataLoader(dataset=dataset,batch_size=batch_size,shuffle=True,num_workers=0)

hidden_size=16
output_size=len(all_tags)
input_size=len(x_train[0])
if torch.cuda.is_available():
    device=torch.device("cuda")
else:
    device=torch.device("cpu")
model=ffnn(input_size,hidden_size,output_size).to(device)

learning_rate=0.001
epochs=200
criteria=nn.CrossEntropyLoss()
optimizer=torch.optim.Adam(model.parameters(),lr=learning_rate)

for epoch in range(epochs):
    for (words,labels) in loader:
        words=words.to(device)
        labels=labels.to(device)
        outputs=model(words)
        loss=criteria(outputs,labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if(epoch +1)%100==0:
        print(f"{epoch+1}/{epochs},loss={loss.item():.4f}")

print(f"final loss,loss={loss.item():.4f}")

data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": all_tags
}
FILE = "data.pth"
torch.save(data, FILE)
print(f"training complete. file saved to {FILE}")

        

