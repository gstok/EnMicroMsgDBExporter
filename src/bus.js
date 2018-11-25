
import Vue from "vue";

let vueBus = new Vue({
    name: "vueBus",
    data () {
        return { };
    },
});

export function emit (event, data) {
    vueBus.$emit(event, data);
}

export function on (event, data) {
    vueBus.$on(event, data);
}
