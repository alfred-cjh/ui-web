<template>
<div>
  <div class= 'animateContent' v-bind:class="[active?'animateIn':'animateOut']">
    <div class='detailInner'>
      <slot></slot>
    </div>
  </div>
  <div class='animate-backup'></div>
</div>
</template>
<script>
export default {
    data: function () {
        return {
            active: 0,
        }
    },
    methods:{
        
    },
    props:['props'],
    watch:{
        props:function(val){
            this.active = val;
        }
    },
}
</script>


  
