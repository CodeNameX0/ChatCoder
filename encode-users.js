#!/usr/bin/env node

/**
 * 사용자 데이터를 Base64로 인코딩하는 도구
 * 실행: node encode-users.js
 */

const users = [
    {"username": "CodeNameX0(정승유)👑", "password": "Qwerty11"},
    {"username": "seomin(서정민)", "password": "QI198B"},
    {"username": "bbangbrothers(윤겸)", "password": "Y3ODGK"},
    {"username": "Joo(주한민)", "password": "FZUQM4"},
    {"username": "Lee_Noel(전태현)", "password": "LZQAX1"},
    {"username": "Ohw-chessuser(김태윤)", "password": "SHNLL7"},
    {"username": "Choi_Nick_chopstick(최시윤)", "password": "ZFO3HY"},
    {"username": "SupepGood(이시완)", "password": "D6WPTR"},
    {"username": "Nok-wodu-okro(김승욱)", "password": "ORD436"}
];

// JSON을 문자열로 변환 후 Base64 인코딩
const jsonString = JSON.stringify(users);
const base64String = Buffer.from(jsonString, 'utf8').toString('base64');

console.log('='.repeat(80));
console.log('🔐 사용자 데이터 Base64 인코딩 결과');
console.log('='.repeat(80));
console.log('\n환경 변수에 설정할 값:');
console.log(`USERS_DATA=${base64String}`);
console.log('\n원본 데이터:');
console.log(JSON.stringify(users, null, 2));
console.log('\n디코딩 테스트:');
const decoded = Buffer.from(base64String, 'base64').toString('utf8');
console.log(JSON.stringify(JSON.parse(decoded), null, 2));
console.log('\n✅ 인코딩/디코딩 성공!');
console.log('='.repeat(80));
