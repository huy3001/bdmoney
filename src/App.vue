<template>
    <div id="app">
        <b-container>
            <HelloWorld msg="Nhập sinh nhật của bạn" />
            <!-- Choose birthday form -->
            <b-form id="birthday" @submit="onSubmit" @reset="onReset">
                <b-row>
                    <b-col cols="12" sm="12" md="4">
                        <b-form-group id="day-selection">
                            <b-form-select
                                id="day"
                                v-model="form.day"
                                :options="days"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="4">
                        <b-form-group id="month-selection">
                            <b-form-select
                                id="month"
                                v-model="form.month"
                                :options="months"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="12" md="4">
                        <b-form-group id="year-selection">
                            <b-form-select
                                id="month"
                                v-model="form.year"
                                :options="years"
                                required
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col cols="12">
                        <b-alert show variant="danger">
                            Ngày bạn chọn hiện chưa có, bạn tìm ngày khác nhé
                        </b-alert>
                        
                        <b-alert show variant="info">
                            Những tờ tiền sinh nhật của bạn
                        </b-alert>

                        <b-alert show variant="success">
                            Có 3 tờ 1K seri AI
                        </b-alert>

                        <b-form-group 
                            id="money-selection" 
                            label="Chọn tờ tiền bạn muốn:"
                        >
                            <b-form-checkbox
                                id="money-checkbox-1"
                                v-model="form.selected"
                                name="money-checkbox-1"
                                value="500"
                            >
                                <b-img src="./assets/500d.jpg" fluid alt="500d"></b-img>
                            </b-form-checkbox>
                        </b-form-group>

                        <b-form-group>
                            <b-form-checkbox
                                id="money-checkbox-2"
                                v-model="form.selected"
                                name="money-checkbox-2"
                                value="1000"
                            >
                                <b-img src="./assets/1000d.jpg" fluid alt="1000d"></b-img>
                            </b-form-checkbox>
                        </b-form-group>

                        <b-form-group>
                            <b-form-checkbox
                                id="money-checkbox-3"
                                v-model="form.selected"
                                name="money-checkbox-3"
                                value="2000"
                            >
                                <b-img src="./assets/2000d.jpg" fluid alt="2000d"></b-img>
                            </b-form-checkbox>
                        </b-form-group>

                        <b-form-group>
                            <b-form-checkbox
                                id="money-checkbox-4"
                                v-model="form.selected"
                                name="money-checkbox-4"
                                value="5000"
                            >
                                <b-img src="./assets/5000d.jpg" fluid alt="5000d"></b-img>
                            </b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                     <b-col cols="12" sm="6" md="6">
                        <b-form-group id="name">
                            <b-form-input
                                v-model="form.name"
                                placeholder="Họ và tên"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>

                    <b-col cols="12" sm="6" md="6">
                        <b-form-group id="phone">
                            <b-form-input
                                v-model="form.phone"
                                placeholder="Số diện thoại"
                            ></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                     <b-col cols="12">
                        <b-form-group id="address">
                            <b-form-input
                                v-model="form.address"
                                placeholder="Địa chỉ cụ thể (số nhà, tên đường, thôn, xóm)"
                            ></b-form-input>
                        </b-form-group>

                        <b-form-group id="note">
                            <b-form-textarea
                                v-model="form.note"
                                placeholder="Nội dung in"
                                rows="3"
                                no-resize
                            ></b-form-textarea>
                        </b-form-group>

                        <b-form-group id="action">
                            <b-button type="submit" variant="primary">Submit</b-button>
                            <b-button type="reset" variant="danger">Reset</b-button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
        </b-container>
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
    name: "App",
    components: {
        HelloWorld,
    },
    data() {
        return {
        form: {
            day: null,
            month: null,
            year: null,
            selected: [],
            name: '',
            phone: '',
            address: '',
            note: ''
        },
        days: [{ text: "Ngày", value: null }, "01", "02", "03"],
        months: [{ text: "Tháng", value: null }, "01", "02", "03"],
        years: [{ text: "Năm", value: null }, "1900", "1901", "1902"],
        moneys: [
            { text: "500d", value: "500" },
            { text: "1000d", value: "1000" },
            { text: "2000d", value: "2000" },
            { text: "5000d", value: "5000" },
        ],
        };
    },
    methods: {
        onSubmit() {},
        onReset() {
            this.form.day = null;
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap-vue/src/index.scss";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
