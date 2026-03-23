//string
//const greet: string = 안녕 -> 따옴표없이 쓰면 값을 찾을 수 없다고 오류 메시지 나옴
const chaenni: string = '채은';
let text: string = 'Hello Welfare!';
let sentance: string = `안녕하세요, ${chaenni}입니다.`;

//number
const age: number = 26;
let intNum: number = 419;
let floatNum: number = 3.14;
let hexNum: number = 0xff;
let binNum: number = 0b1010;
let octNum: number = 0o52;
//const year: number = "2026" -> number에 문자열 형식으로 적으면 오류

//boolean
const isWoman: boolean = true;
const isFreshman: boolean = false;
//비교연산식 적어도 boolean사용 가능
const isTrue: boolean = 2 < 3;
//const isName: boolean = -1; ->true와 false를 제외한 것을 쓰면 오류 남

//null
const isNull: null = null;
let user: string | null = null;
let user1: string | null = '안녕하세요';
//let fail: string = null; -> string에 null을 할당할 수 없습니다.
//let fail: null = "안녕하세요"; -> null에 string 할당할 수 없습니다.

//undefined
/* const는 무조건 초기화 해야하므로 undefined 사용 불가능
const inUndefined: undefined;*/
let limit: undefined;
let arr: [];

//Symbol
let firstS: symbol = Symbol('symbol');
let secondS: string = 'symbol';

//bigint
let bigNum: bigint = 10n;
let bigNum2: bigint = BigInt(20);
// let big: bigint = 10; -> 실패 케이스

//object
let fullName: { first: string; last: string } = {
  first: 'Shon',
  last: 'CHaeeun',
};
/*객체 내부 속성에 ;사용 못 함
let fullName: {first: string; last: string} = {
  first: "Shon",
  last: "CHaeeun";
}
*/
/*
형식 리터럴 속성에는 이니셜라이저 사용 못함
let To_Date: {Month: number = 1; Day: number} = {
  Month: 2,
  Day: 5
}*/

//any
let value: any;
value = 123;
value = 'string';
value = true;
value = 10n;
value = null;

//unknown
//타입 검증
let data: unknown;
data = '안녕하세요';
data = 123;

if (typeof data === 'string') {
  console.log(data);
} else if (typeof data === 'number') {
  console.log(data);
}

//객체 검증
let obj: unknown;
obj = new Date();

if (obj instanceof Date) {
  console.log(obj.getDate());
}

//void
function sum(x: number, y: number): void {
  console.log(x + y);
}

//never: 절대 값을 반환하지 않는 함수
//예외 처리하는 함수
function throwError(message: string): never {
  throw new Error(message);
}

//무한 루프 함수
function infiniteLoop(): never {
  while (true) {
    console.log('running...');
  }
}
