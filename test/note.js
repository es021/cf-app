import obj2arg from 'graphql-obj2arg';
let q = `mutation{add_skill(${obj2arg(ins, { noOuterBraces: true })}) {ID label}}`;
