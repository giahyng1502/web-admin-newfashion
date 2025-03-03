import React, { useEffect, useState } from 'react';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CategoryList from "./category-list";
import { getCategories } from "../../redux/reducer/categoryReducer";
import {useDispatch, useSelector} from "react-redux";
import {getAll} from "../../redux/reducer/categoryReducer";

function Category() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const categories = useSelector(state => state.category.data);
    const dispatch = useDispatch();
    useEffect(() => {
        getCategories().then((data) => {
            dispatch(getAll(data))
        });
    }, [dispatch]);
    console.log(categories)
    return (
        <CategoryList colors={colors} categories={categories} dispatch={dispatch}/>
    );
}

export default Category;
