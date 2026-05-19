import nltk
from nltk.tokenize import word_tokenize
nltk.download('punkt')
nltk.download('punkt_tab')
sent="hi my name is keshav"

#tokenization 
def tokenize(sent):
    tokenized=word_tokenize(sent)
    return tokenized

print(tokenize(sent))

#