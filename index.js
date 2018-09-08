class Render {
    constructor(arr) {
        this.x = arr.length;
        this.y = arr[0].length;
        this.arr = arr;
        this.init();
    }

    replaceText (str, before, after) {
        return str.replace("%" + before + "%", after);
    }

    render () {
        let table = "<table>%rows%</table>";
        let row = "<tr>%cells%</tr>";
        let cell = "<td>%value%</td>";
        let r ="";
        let c = "";
        for (let i = 0; i < this.x; i++) {
            c = "";
            for (let j = 0; j < this.y; j++) {
                c += this.replaceText(cell, "value",  this.arr[i][j])
            }
            r += this.replaceText(row, "cells", c);
        }
        let t = this.replaceText(table, "rows", r);
        return t;
    }

    init () {
        let div = document.createElement('div');
        div.innerHTML = this.render();
        document.getElementsByTagName('body')[0].appendChild(div)
            .appendChild(document.createElement("hr"));
    }
}

class State {
    constructor(arr, x, y) {
        this.state = {x: x,y: y};
        this.current = arr.map((item) => {
            return item.slice();
        });
        this.parent = null;
    }
    setParent(state) {
        this.parent = state;
    }
    print(){
        console.log(this.parent);
        if (this.parent != null){
            this.print(this.parent);
        }
        var x = new Render(this.current);
    }
}

class Operator {
    constructor(operator) {
        //0: up
        //1: down
        //2: left
        //3: right
        this.value = operator;
    }
    up(state) {
        let x = state.state.x;
        let y = state.state.y;
        let newState = new State(state.current, x, y);
        if (y < 2){
            newState.current[y][x] = newState.current[y + 1][x];
            newState.current[y + 1][x] = 0;
            newState.state = {x: x, y: y + 1};
            return newState;
        }
        return null;
    }
    down(state) {
        let x = state.state.x;
        let y = state.state.y;
        let newState = new State(state.current, x, y);
        if (y > 0){
            newState.current[y][x] = newState.current[y - 1][x];
            newState.current[y - 1][x] = 0;
            newState.state = {x: x, y: y - 1};
            return newState;
        }
        return null;
    }
    left(state) {

        let x = state.state.x;
        let y = state.state.y;
        let newState = new State(state.current, x, y);
        if (x < 2){
            newState.current[y][x] = newState.current[y][x + 1];
            newState.current[y][x + 1] = 0;
            newState.state = {x: x + 1, y: y};
            return newState;
        }
        return null;
    }
    right(state) {

        let x = state.state.x;
        let y = state.state.y;
        let newState = new State(state.current, x, y);
        if (x > 0){
            newState.current[y][x] = newState.current[y][x - 1];
            newState.current[y][x - 1] = 0;
            newState.state = {x: x - 1, y: y};
            return newState;
        }
        return null;
    }
}

class Search {
    constructor (goal, current) {
        this.goal = goal.current.map((item) => {
            return item.join("");
        }).join("");
        this.current = current;
    }

    search() {
        // console.log(this.current);
        // console.log(this.current.current.map((item) => {
        //     return item.join("");
        // }).join(""));
        let open = [];
        let close = [];
        open.push(this.current);
        let op = new Operator();
        let o;
        let i =0;
        while (open.length != 0) {
            o = open.shift();
            close.push(o);
            if (o.current.map((item) => {
                return item.join("");
            }).join("") == this.goal) {
                return o;
                break;
            };
            let child = [op.up(o), op.down(o), op.left(o), op.right(o)];
            child.forEach((item) => {
                if (item != null) {
                    //check if item is existed not push
                    if (!this.checkExist(item, close)) {
                        item.setParent(o);
                        open.push(item);
                    };
                }
            });
        }
        return null;
    }

    checkExist(item, close){
        return close.every((i) => {
            return this.equal(i.current, item.current);
        })
    }
    equal(a, b){
        let keyA = a.map((item) => {
            return item.join("");
        }).join("");
        let keyB = b.map((item) => {
            return item.join("");
        }).join("");

        return keyA == keyB;
    }
}
