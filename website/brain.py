import nltk
import numpy as np
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
nltk.download('punkt')
nltk.download('punkt_tab')

#tokenization 
def tokenize(sent):
    tokenized=word_tokenize(sent)
    return tokenized

# tokenized_array=tokenize(sent)

#lower + stemming
def stem_lower(tokenized_array):
    porter=PorterStemmer()
    stemed=[porter.stem(i) for i in tokenized_array]
    stem_lowered=[i.lower() for i in stemed]
    return stem_lowered

# bag of words
def bag_of_words(tokenized_array,all_words):
    stem=stem_lower(tokenized_array)
    bag=np.zeros(len(all_words),dtype=np.float32)
    for idx,w in enumerate(all_words):
        if w in stem:
            bag[idx]=1.0
    return bag

# a=["hi","my","name","is","keshav"]
# b=["hi","hello","bye","name","is","what","and","ok"]
# print(bag_of_words(a,b))
