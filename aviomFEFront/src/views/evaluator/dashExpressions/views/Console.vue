<template>
  <div>
    <v-container fluid wrap>
      <v-layout column wrap fill-height>
        <v-card width="100%" height="100%">
          <v-card-title>Consola</v-card-title>
          <v-textarea
            v-model="expression"
            clearable
            label="Expresión"
            :hint="'Usa \''+toSaveVariableDelimitter+'\' para guardar expresiones de forma local. Y \''+localVariableDelimitter+'\' para usar las expresiones'"
            auto-grow
            rows="1"
            prepend-inner-icon="mdi-iframe-variable-outline"
            row-height="1"
            @keypress.enter="onEvaluateExpressionEvent"
            @keydown.up="onKeyUp"
            @keydown.down="onKeyDown"
            class="mb-0 mt-0 ml-2 mr-2"
          ></v-textarea>
          <v-container
            id="scroll-target"
            v-bind:style="{height:height+'px'}"
            class="overflow-y-auto"
          >
            <v-list>
              <v-layout column wrap>
                <p v-bind:key="i" v-for="(item,i) in evaluatedExpressions">
                  <span class="font-weight-bold">{{item.expression}}:</span>

                  <span class="font-italic d-block">
                    {{item.value}}
                    <v-menu bottom right transition="scale-transition" origin="top left">
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          text-color="white"
                          small
                          color="orange"
                          class="ml-0 pb-1 mr-2"
                        >mdi-information-variant</v-icon>
                      </template>
                      <v-card color="red">
                        <v-list dark>
                          <v-list-item>
                            <v-list-item-content>
                              <v-list-item-title>{{item.value_type}}</v-list-item-title>
                              <v-list-item-subtitle>{{item.value}}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </span>
                </p>
              </v-layout>
            </v-list>
          </v-container>
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
const evaluateExpressionEvent = "evaluateExpression";
const createLocalVariableEvent = "createLocalVariable";
const clearEvent = "clearExpressions";
const replaceDoubleQuotes = /"/g;
const replaceSpecialDoubleQuotes = /”/g;
const replaceWhiteSpaces=/\s/g;
const localVariableDelimitter = "$";
const toSaveVariableDelimitter = "=";
export default {
  name: "Console",
  props: {
    evaluatedExpressions: Array,
    height: Number,
    localVariables: Object
  },
  data() {
    return {
      expression: "",
      currentIndex: -1,
      currentExpression: "",
      localVariableDelimitter: localVariableDelimitter,
      toSaveVariableDelimitter: toSaveVariableDelimitter
    };
  },
  methods: {
    onEvaluateExpressionEvent(event) {
      event.preventDefault();
      let toEvaluateExpression = this.replaceByVariableExpression(
        this.transformExpression(this.expression)
      );
      if (toEvaluateExpression !== "") {
        let indexOfEqualsCharacter = toEvaluateExpression.indexOf(
          toSaveVariableDelimitter
        );
        if (indexOfEqualsCharacter != -1) {
          let name = toEvaluateExpression.substring(0, indexOfEqualsCharacter).replace(replaceWhiteSpaces,"");
          let expression = toEvaluateExpression.substring(
            indexOfEqualsCharacter + 1,
            toEvaluateExpression.length
          );
          this.$emit(createLocalVariableEvent, {
            name: name,
            expression: expression
          });
        } else if (toEvaluateExpression === "clear") {
          this.$emit(clearEvent);
        } else {
          this.$emit(evaluateExpressionEvent, toEvaluateExpression);
        }
        this.expression = "";
        this.currentIndex = -1;
      }
    },
    transformExpression(expression) {
      let transformed = expression
        .replace(replaceDoubleQuotes, "'")
        .replace(replaceSpecialDoubleQuotes, "'")
      return transformed;
    },
    onKeyUp(event) {
      event.preventDefault();
      if (this.currentIndex == -1) {
        this.currentExpression = this.expression;
      }
      if (this.evaluatedExpressions.length > 0) {
        if (this.currentIndex + 1 < this.evaluatedExpressions.length) {
          this.currentIndex++;
          this.expression = this.evaluatedExpressions[
            this.currentIndex
          ].expression;
        }
      } else {
        this.currentIndex = -1;
      }
    },
    onKeyDown(event) {
      event.preventDefault();
      if (this.evaluatedExpressions.length > 0) {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.expression = this.evaluatedExpressions[
            this.currentIndex
          ].expression;
        } else if (this.currentIndex == 0) {
          this.currentIndex = -1;
          this.expression = this.currentExpression;
        } else {
          this.expression = "";
          this.currentExpression = "";
        }
      } else {
        this.currentIndex = -1;
      }
    },
    replaceByVariableExpression(expression) {
      let indexes = [];
      let replaced = expression;
      for (let i = 0; i < replaced.length; i++) {
        if (replaced[i] === localVariableDelimitter) {
          indexes.push(i + 1);
        }
      }
      Object.keys(this.localVariables).forEach(element => {
        let replaceVariableRegExp = new RegExp(
          "\\" + localVariableDelimitter + element
        );
        replaced = replaced.replace(
          replaceVariableRegExp,
          this.localVariables[element]
        );
      });

      return replaced;
    }
  }
};
</script>

<style scoped>
p {
  word-break: break-all;
  white-space: normal;
}
</style>