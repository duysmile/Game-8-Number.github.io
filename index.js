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
            newState.current[x][y] = newState.current[x][y + 1];
            newState.current[x][y + 1] = 0;
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
            newState.current[x][y] = newState.current[x][y - 1];
            newState.current[x][y - 1] = 0;
            newState.state = {x: x, y: y - 1};
            return newState;
        }
        return null;
    }
    right(state) {
        let x = state.state.x;
        let y = state.state.y;
        let newState = new State(state.current, x, y);
        if (x < 2){
            newState.current[x][y] = newState.current[x + 1][y];
            newState.current[x + 1][y] = 0;
            newState.state = {x: x + 1, y: y};
            return newState;
        }
        return null;
    }
    left(state) {
        let x = state.state.x;
        let y = state.state.y;
        let newState = new State(state.current, x, y);
        if (x > 0){
            newState.current[x][y] = newState.current[x - 1][y];
            newState.current[x - 1][y] = 0;
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
        this.search();
    }

    search() {
        console.log(this.goal);
        // console.log(this.current);
        // console.log(this.current.current.map((item) => {
        //     return item.join("");
        // }).join(""));
        let open = [];
        open.push(this.current);
        let op = new Operator();
        let o;
        let i =0;
        // while (i < 10) {
        //     i++;
            o = open.pop();
            //TODO: assign closed array for o
            if (o.current.map((item) => {
                return item.join("");
            }).join("") == this.goal) {
                return o;
            };
            let child = [op.up(o), op.down(o), op.left(o), op.right(o)];
            child.forEach((item) => {
                if (item != null) {
                    console.log(item);
                    //check if item is existed not push
                    if (open.every((i) => {
                        console.log('here: ', o, i, item)
                        return i != item;
                    }));
                        // open.push(item);
                }
            })
            // console.log(o);
        // }
    }
}

//TODO: function to check if state is existed in open