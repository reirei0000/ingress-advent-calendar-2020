import pandas as pd

v = []
d = pd.read_csv(open('data.csv'))
for _, d in d.iterrows():
    v += [{
      "question": d['yomi'],
      "answer": d['moji']
    }]

print(v);
