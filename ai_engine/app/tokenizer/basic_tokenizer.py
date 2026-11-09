import re 
from collections import Counter

class BasicTokenizer:
     def __init__(self):
        self.special_tokens = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"]

        self.token_to_id = {}
        self.id_to_token = {}