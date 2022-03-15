
const rdl = require("readline")
let Unit = require('./unit')
let width = 6;
let height = 6;

let getSymbol = (x)=>{
    if(x <= 25 ) return '.'
    if(x <= 55) return ','
    if(x <= 80) return ';'
    if(x <= 105) return '!'
    if(x <= 130) return 'v'
    if(x <= 155) return 'l'
    if(x <= 180) return 'L'
    if(x <= 205) return 'F'
    if(x <= 230) return 'E'
    if(x <= 256) return '$'
}
// 0 - empty 1 -wall 2 - food
let map = [
    // [1,1,1,1,1,1,1,1,1,1,1],
    // [1,0,1,0,0,0,0,0,0,0,1],
    // [1,0,1,0,0,1,0,1,0,0,1],
    // [1,0,1,0,0,1,0,1,1,0,1],
    // [1,0,0,0,1,1,0,0,0,0,1],
    // [1,0,1,1,1,0,0,1,1,1,1],
    // [1,0,0,0,0,0,0,0,0,0,1],
    // [1,0,0,1,1,1,0,0,1,0,1],
    // [1,0,1,1,0,0,1,1,1,0,1],
    // [1,0,0,0,0,0,0,0,0,0,1],
    // [1,1,1,1,1,1,1,1,1,1,1]
    [1,1,1,1,1,1],
    [1,2,1,1,1,1],
    [1,0,1,1,1,1],
    [1,0,1,0,1,1],
    [1,0,0,0,1,1],
    [1,1,1,1,1,1]
];

let unit = new Unit(map);

let food = {x:1,y:1};

let render =()=>{
    process.stdout.write("\x1B[?25l")

    //background
    for(let y=0;y<height;y++){
        rdl.cursorTo(process.stdout, 0, y);
        for(let x = 0;x<width;x++){
            let val = '\u2591'
            switch(map[y][x]){
                case(1):{
                    val = '\u2588'
                    break;
                }
                case(2):{
                    val = 'F'
                    break;
                }
                default:{
                    break;
                }
            }
            process.stdout.write(val);
            process.stdout.write(val);
        }
        process.stdout.write('\n');
    }

    //unit
    rdl.cursorTo(process.stdout, unit.x*2, unit.y);
    process.stdout.write('\\');
    process.stdout.write('/');
    //unit memory
    rdl.cursorTo(process.stdout, 22, 0);
    for(let j=0;j<8*9;j++){
        process.stdout.write(getSymbol(unit.memory[0][j]));
    }

    for(let i=0;i<8;i++){
        rdl.cursorTo(process.stdout, 22, i+2);
        for(let j=0;j<8*9;j++){
        
            process.stdout.write(getSymbol(unit.memory[1][i* 8*9 + j]));
        }
    }

    //food
    rdl.cursorTo(process.stdout, 0, 13);
    process.stdout.write(''+unit.associate.dataset.length);
    //process.stdout.write('F');
}

let step = async ()=>{
    
    await unit.step(map);
    
}

setInterval(async ()=>{
    await step();
    render();
},11)