class Render {
    constructor(arr) {
        this.x = arr.length;
        this.y = arr[0].length;
        this.arr = arr;
        this.init();
    }

    replaceText(str, before, after) {
        return str.replace("%" + before + "%", after);
    }

    render() {
        let table = "<table>%rows%</table>";
        let row = "<tr>%cells%</tr>";
        let cell = "<td>%value%</td>";
        let r = "";
        let c = "";
        for (let i = 0; i < this.x; i++) {
            c = "";
            for (let j = 0; j < this.y; j++) {
                c += this.replaceText(cell, "value", this.arr[i][j])
            }
            r += this.replaceText(row, "cells", c);
        }
        let t = this.replaceText(table, "rows", r);
        return t;
    }

    init() {
        let div = document.createElement('div');
        div.innerHTML = this.render();
        document.getElementsByTagName('body')[0].appendChild(div)
            .appendChild(document.createElement("hr"));
    }
}

class State {
    constructor(arr, x, y) {
        this.g = 0;
        this.state = {x: x, y: y};
        this.current = arr.map((item) => {
            return item.slice();
        });
        this.parent = null;
    }

    setG(g) {
        this.g = g;
    }

    setParent(state) {
        this.parent = state;
    }

    setH(goal) {
        let h = 0;
        for (let y = 0; y < this.current.length; y++) {
            for (let x = 0; x < this.current[y].length; x++) {
                if (this.current[y][x] == goal[y][x] || this.current[y][x] == 0) {
                    continue;
                }
                let point = this.find(this.current[y][x], goal);
                h += Math.abs(x - point.x) + Math.abs(y - point.y);
            }
        }
        // console.log(this.current, h);
        this.h = h;
    }

    find(point, goal) {
        for (let y = 0; y < goal.length; y++) {
            for (let x = 0; x < goal[y].length; x++) {
                if (point == goal[y][x]) {
                    return {x: x, y: y};
                }
            }
        }
        return {x: 0, y: 0};
    }

    print() {
        if (this.parent != null) {
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
        if (y < 3) {
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
        if (y > 0) {
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
        if (x < 3) {
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
        if (x > 0) {
            newState.current[y][x] = newState.current[y][x - 1];
            newState.current[y][x - 1] = 0;
            newState.state = {x: x - 1, y: y};
            return newState;
        }
        return null;
    }
}

class Search {
    constructor(goal, current) {
        this.goal = goal.current.map((item) => {
            return item.join("");
        }).join("");
        this.current = current;
        this.current.setH(goal.current);
    }

    search(goal) {
        let open = new PriorityQueue([], (a, b) => {
            return (a.g + a.h) > (b.g + b.h);
        });
        let close = {};
        open.push(this.current);
        let op = new Operator();
        let o;
        let count = 0;
        while (open.length != 0) {
            count++;
            console.log(count);
            o = open.shift();
            close[this.pushKey(o.current)] = o;
            if (o.current.map((item) => {
                return item.join("");
            }).join("") == this.goal) {
                console.log(count);
                return o;
                break;
            }
            let child = [op.up(o), op.down(o), op.left(o), op.right(o)];
            child.forEach((item) => {
                if (item != null) {
                    //check if item is existed not push
                    if (!this.checkExist(this.pushKey(item.current), close)) {
                        item.setParent(o);
                        //if you want to find the fastest way
                        // uncomment the line below
                        // item.setG(item.parent.g + 1);
                        item.setH(goal);
                        open.push(item);
                    }
                }
            });
        }
        return null;
    }

    checkExist(item, close)
    {
        return close[item] != null;
    }

    pushKey(arr)
    {
        return arr.reduce((acc, curr) => {
            return acc + curr;
        }, "")
    }

}
class PriorityQueue {
    constructor(array, comparator) {
        let arr = array.slice().sort(comparator);
        this.arr = arr ? arr : [];
        this.comparator = comparator;
    }

    push(item) {
        if (this.arr.length == 0) {
            this.arr[0] = item;
            return;
        }
        let i = 0;
        for (i; i < this.arr.length; i++) {
            if (!this.comparator(item, this.arr[i])) {
                break;
            }
        }
        this.arr.splice(i, 0, item);
    }

    pop() {
        return this.arr.pop();
    }

    shift() {
        return this.arr.shift();
    }

    unshift() {
        return this.arr.unshift();
    }
}
