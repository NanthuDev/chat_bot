import re 
from collections import Counter

class BasicTokenizer:
     def __init__(self):
        self.special_tokens = ["<PAD>", "<UNK>", "<BOS>", "<EOS>"]

        self.token_to_id = {}
        self.id_to_token = {}


     def train(self, texts):
        """
        Build vocabulary from a collection of text.
        """
        counter = Counter()

        for text in texts:
            tokens = self._split(text)
            counter.update(tokens)
            print(counter)
        vocabulary = self.special_tokens + sorted(counter.keys())

        self.token_to_id = {
            token: index
            for index, token in enumerate(vocabulary)
        }

        self.id_to_token = {
            index: token
            for token, index in self.token_to_id.items()
        }
        
     def _split(self, text):
        """
        Split text into words and punctuation.
        """
        return re.findall(r"\w+|[^\w\s]", text.lower())