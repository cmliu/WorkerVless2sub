import re
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List

import requests
from pydantic import BaseModel


class Rss(BaseModel):
    tiele: str = ""
    link: str = ""
    pub_date: datetime = datetime.now()
    description: str = ""

    def __str__(self):
        return f"标题：{self.tiele}\n链接：{self.link}\n发布时间：{self.pub_date}\n描述：{self.description}\n"


class IPData(BaseModel):
    Region: str = ""
    IP: str = ""
    Port: str = ""
    Latency: str = ""
    Speed: str = ""
    DC: str = ""
    City: str = ""
    ASN: str = ""
    AS_Name: str = ""

    def __str__(self):

        return f"地区：{self.Region}\nIP：{self.IP}\n端口：{self.Port}\n延迟：{self.Latency}\n速度：{self.Speed}\n数据中心：{self.DC}\n城市：{self.City}\nASN：{self.ASN}\nAS名称：{self.AS_Name}\n"


# 获取rss中的信息
def get_rss_info(rss_url: str) -> List[Rss]:
    # 解析rss文件
    rss_data = []
    root = ET.fromstring(requests.get(url=rss_url).text)
    for index, elem in enumerate(root[0].iter(tag="item")):
        if index == 8:
            break  # 限制输出8条信息
        # 标题
        title = elem[0].text
        # 描述
        description = elem[1].text
        # 链接
        link = elem[2].text
        # 发布时间
        pub_date = datetime.strptime(elem[4].text, "%a, %d %b %Y %H:%M:%S %Z")
        rss_data.append(
            Rss(tiele=title, link=link, pub_date=pub_date, description=description)
        )
    return rss_data


# 处理title信息
def process_title(title: str) -> IPData:
    # 处理标题
    pattern = r"\[([^\]]+)\]\s*([^[]*)"
    matches = re.findall(pattern, title)
    data = IPData(
        Region=matches[0][1].strip(),
        IP=matches[1][1].strip(),
        Port=matches[2][1].strip(),
        Latency=matches[3][1].strip(),
        Speed=matches[4][1].strip(),
        DC=matches[5][1].strip(),
        City=matches[6][1].strip(),
        ASN=matches[7][1].strip(),
        AS_Name=matches[8][1].strip(),
    )
    return data


if __name__ == "__main__":
    rss_url = "https://rsshub.app/telegram/channel/cf_no1"
    data_list = get_rss_info(rss_url)
    with open("addressesapi.txt", "w", encoding="utf-8") as f:
        for data in data_list:
            t = process_title(data.tiele)
            ip = f"{t.IP}:{t.Port}"
            speed = t.Speed.split("|")[1].strip()
            name = f"{t.Region} | {t.Latency} | {speed}"
            f.writelines(f"{ip}#{name}\n")
