# coding: UTF-8
import os
import re
import json
import urllib2
from bs4 import BeautifulSoup

crrDir = os.path.dirname(os.path.abspath(__file__))

for i in range(15, 21):
  level = str(i)

  url = "http://www.sdvx.in/sort/sort_" + level + ".htm"
  html = urllib2.urlopen(url)
  soup = BeautifulSoup(html, "html.parser")
  body = str(soup.body)

  f = open(crrDir + "/" + level + ".html" + ".txt", "w")
  f.write(body)
  f.close()

  f = open(crrDir + "/" + level + ".html" + ".txt", "r")
  flines = f.readlines()
  f.close()

  data = {}
  difficultyMap = {"a": "ADV", "e": "EXH", "i": "INF", "g": "GRV", "h": "HVN", "m": "MXM"}
  difficultyVerMap = {"i": "02", "g": "03", "h": "04"}
  for fline in flines:
    id_data = re.search("SORT(.+?)\(\)", fline)
    name_data = re.search("<!--(.+?)-->", fline)
    if id_data and name_data:
      id = id_data.group(1).lower()
      name = name_data.group(1)
      difficulty = "-"
      for k, v in difficultyMap.iteritems():
        if k in id: difficulty = v
      ver = id[0:2]
      for k, v in difficultyVerMap.iteritems():
        if k in id: ver = v
      path = "/" + ver + "/" + id

      value = {
        "id": id,
        "name": name,
        "difficulty": difficulty,
        "ver": ver,
        "path": path
      }
      data[id] = value

  jsonstr = json.dumps(data, ensure_ascii=False)
  f = open(crrDir + "/" + level + ".json", "w")
  f.write(jsonstr)
  f.close()
