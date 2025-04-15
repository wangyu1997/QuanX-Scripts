let body = $response.body;
let obj = JSON.parse(body);

if (obj && obj.contents && Array.isArray(obj.contents)) {
  obj.contents.forEach(item => {
    if (item.hasOwnProperty('vip')) {
      item.vip = true;
    }
    if (item.hasOwnProperty('forbidden')) {
      item.forbidden = false;
    }
  });
}

$done({body: JSON.stringify(obj)});
