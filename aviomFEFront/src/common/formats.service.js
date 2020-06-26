const FormatsService = {
    format_date(date){
        //use toLocaleDateString function options for a more personalized format.
        return new Date(date).toLocaleDateString("en-US");
    }
}

export default FormatsService;