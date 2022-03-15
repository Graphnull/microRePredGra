
let associate = require('./associate')

const rdl = require("readline")
const OUTPUTSENSORSIZE = 1+8
console.log((8*OUTPUTSENSORSIZE)**4)


/**
 * 
 * @param {number[]} arr 
 */
let findMaxIndex = (arr)=>{
    let maxv = -Infinity;
    let maxI = 0;
    arr.forEach((v, i)=>{
        if(v>maxv){
            maxv = v;
            maxI = i;
        }
    })
    return maxI;
}
module.exports = class Unit {
    constructor(map){
        this.map = map;
        this.regenerate();
    }
    regenerate(){
        let positions = [].concat(...this.map)
        positions = positions.map((v,i)=>i)
        positions = positions.sort((l,r)=>{
            let lx = l%this.map[0].length;
            let ly = Math.floor(l/this.map[0].length);
            let lv = this.map[ly][lx]===1?0:Math.random();
            
            let rx = r%this.map[0].length;
            let ry = Math.floor(r/this.map[0].length);
            let rv = this.map[ry][rx]===1?0:Math.random();
            return rv-lv
        })
        this.x = positions[0]%this.map[0].length;
        this.y = Math.floor(positions[0]/this.map[0].length);
        this.foodLevel = 10;
    }
    x = 3;
    y = 3;
    foodLevel = 10;
    associate = new associate()
    memory =[
        new Uint8Array((8**1)*OUTPUTSENSORSIZE),
        new Uint8Array((8**2)*OUTPUTSENSORSIZE),
        new Uint8Array((8**3)*OUTPUTSENSORSIZE),
        new Uint8Array((8**4)*OUTPUTSENSORSIZE),
        new Uint8Array((8**5)*OUTPUTSENSORSIZE),
        new Uint8Array((8**6)*OUTPUTSENSORSIZE),
    ]
    getVisualSensors (map){
        return new Uint8Array([
            this.foodLevel,
            map[this.y-1][this.x-1],
            map[this.y-1][this.x+0],
            map[this.y-1][this.x+1],
            map[this.y+0][this.x-1],
            map[this.y+0][this.x+1],
            map[this.y+1][this.x-1],
            map[this.y+1][this.x+0],
            map[this.y+1][this.x+1]
        ]);
    }
    validStep(map, dx,dy){
        return map[this.y+dy][this.x+dx]!==1
    }
/**
 * 
 * @param {number[][]} map 
 */
    async step(map){
        rdl.cursorTo(process.stdout, 0, 10);

        let oldSensors = this.getVisualSensors(map)
        
        let memProcess = (mem, outMem, sSize)=>{
            for(let s=0;s<sSize;s++){
                let sensors = mem.subarray(s*OUTPUTSENSORSIZE+1, s*OUTPUTSENSORSIZE+OUTPUTSENSORSIZE);
                //Обновление первой волны
                for(let i=0;i<8;i++){
                    let sensorsAndActions = [...sensors];
                    let actions = [0,0,0,0,0,0,0,0];
                    actions[i] = 1;
                    sensorsAndActions = sensorsAndActions.concat(actions)
                    let output = this.associate.find(sensorsAndActions);
                    for(let j=0;j<OUTPUTSENSORSIZE;j++){
                        outMem[s*8*OUTPUTSENSORSIZE +i*OUTPUTSENSORSIZE+j] = output[j];
                    }
                }
            }
        }
        
        let mem = this.getVisualSensors(map);
        let outMem = this.memory[0];
        let sSize = 8**0;
        memProcess(mem, outMem, sSize);
        for(let i=1;i<6;i++){
            let  mem =  this.memory[i-1];
            let outMem = this.memory[i];
            let sSize = 8**i;
            memProcess(mem, outMem, sSize);
        }

        //Найти в memoryLevel точку с наибольшим foodLevel
        //TODO улучшить через сравнение и объединить с следующим шагом
        let l6Action = findMaxIndex(this.memory[5].filter((v,i)=>i%OUTPUTSENSORSIZE===0));

        //вычислить путь до исходной точки
        let l5Action = Math.floor(l6Action/8);
        let l4Action = Math.floor(l5Action/8);
        let l3Action = Math.floor(l4Action/8);
        let l2Action = Math.floor(l3Action/8);
        let l1Action = Math.floor(l2Action/8);
        console.log(l1Action)
        if(Math.random()<0.1){
            l1Action = Math.floor(Math.random()*8);
        }
        //Сделаем шаг
        let dx=0;
        let dy=0
        if(l1Action<3){
            dy-=1;
        }else if(l1Action>4){
            dy+=1;
        }
        if(l1Action===0 ||l1Action===3 || l1Action===5){
            dx-=1;
        }else if(l1Action===2 ||l1Action===4 || l1Action===7){
            dx+=1;
        }
        if(this.validStep(map,dx,dy)){
            this.y+=dy;
            this.x+=dx;
        }

        this.foodLevel = this.foodLevel-1;
        let find = false
        if(map[this.y][this.x]===2){
            this.foodLevel = 10;
            find = true;
        }

        
        console.log(this.foodLevel)
        let output = this.getVisualSensors(map);
        this.associate.push(oldSensors, output);
        if(find){
            this.regenerate()
        }
        if(this.foodLevel<0){
            this.regenerate()
        }
        //await new Promise((res)=>{setTimeout(res,10)})
    }

}