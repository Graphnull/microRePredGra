
module.exports = class Memory {

/**
 * @type {{input:number[],output:number[]}[]}
 */
    dataset=[]
    /**
     * 
     * @param {number[]} input 
     * @param {number[]} output 
     */
    push(input, output){
        this.dataset.push({input, output});

    }
    /**
     * 
     * @param {number[]} input 
     */
    find(input){

        let minV = Infinity;
        let minI = this.dataset[0];
        if(!minI){
            return [Math.random()*1,Math.random()*255,Math.random()*255,Math.random()*255,Math.random()*255,Math.random()*255,Math.random()*255,Math.random()*255,Math.random()*255]
            //throw new Error('Empty dataset')
        }
        for(let j =0;j<this.dataset.length;j++){
            let v = this.dataset[j]
            let dist = 0;
            for(let i =0;i<input.length;i++){
                let iv = input[i];
                dist+=Math.pow(iv-v.input[i], 2);
            }
            if(dist<=minV){
                minV =dist
                minI = v
            }
        }
        return minI.output;
    }
}