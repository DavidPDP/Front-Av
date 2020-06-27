<template>
  <v-card :color="!!color?color:'white'" class="mx-auto" height="100%">
    <v-list-item three-line>
      <v-list-item-content>
        <p
          :class="['overflow overline mb-1',!!textColor?textColor+'--text':'']"
        >{{data.title}}</p>
        <!-- <div class="overline mb-4"></div> -->
        <v-list-item-subtitle
          :class="['card_text',!!textColor?textColor+'--text':'']"
        >{{data.value+' '+data.valueSuffix}}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar>
        <v-icon :color=data.iconColor large>{{data.icon}}</v-icon>
      </v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <div v-if="data.hasNotes">
        <p class="action_element">
          <span class="ml-0 mr-2 action_element danger">{{data.lastValue+' '+data.valueSuffix}}</span>
          {{data.notes.label}}
        </p>
      </div>
      <v-spacer></v-spacer>
      <v-btn
        v-if="data.hasDetails"
        text
        small
        color="primary text-overline"
        @click="showDetails(data)"
      >Ver detalles ></v-btn>
    </v-card-actions>
    <v-overlay :absolute="true" :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
const showDetailsEvent = "showDetailsEvent";
export default {
  props: {
    data: Object,
    color: String,
    textColor: String,
    loading:Boolean
  },

  methods: {
    showDetails(data) {
      data.showDetails = true;
      this.$emit(showDetailsEvent, data);
    }
  }
};
</script>

<style>
.card_text {
  font-size: 25px;
}

.action_element {
  margin-left: 10px;
  font-size: 12px;
  color: gray;
}

.danger {
  color: red;
}
</style>