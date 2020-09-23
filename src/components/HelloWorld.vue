<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
export default {
    name: "HelloWorld",
    props: {
        msg: String,
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1 {
    font-size: 1.5rem;
    margin-bottom: 2rem;

    @media (min-width: 768px) {
        font-size: 2rem;
    }

    @media (min-width: 1200px) {
        font-size: 2.5rem;
    }
}
</style>
