/* eslint-disable eqeqeq */
// Imports
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TextField from '@mui/material/TextField'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { matchSorter } from 'match-sorter'

import { showMessage } from 'setup/messageSlice'
import { marketplaceCategory } from '../../marketplace/api/query'

export default function InventoryModal({ watch, setValue }) {
  const dispatch = useDispatch()
  const [categories, setCategories] = useState([])
  console.log(
    '🚀 ~ file: CategorySelectBox.js ~ line 14 ~ InventoryModal ~ categories',
    categories,
  )
  const [subCategories, setSubCategories] = useState([])
  const [rootValue, setRootValue] = useState()
  const productName = watch('productName')

  // on load
  useEffect(() => {
    marketplaceCategory({
      type: 'suggestions',
      body: { category: productName },
    }).then(({ data }) => {
      if (data.success) {
        setCategories(data.data)
      } else {
        dispatch(showMessage({ message: data.message, variant: 'error' }))
      }
    })
    // return () => dispatch({ type: SET_INIT })
  }, [])

  useEffect(() => {
    const _subCategories = categories.find(
      (item) => item.category?.categoryId == rootValue?.categoryId,
    )?.categoryTreeNodeAncestors
    if (_subCategories) {
      setSubCategories(_subCategories)
    }
  }, [rootValue])

  // const filterOptions = (options, { inputValue }) => matchSorter(options.map((option) => option.categoryName), inputValue)

  const filterOptions = createFilterOptions({
    // matchFrom: 'start',
    stringify: (option) => option?.category?.categoryName,
  })

  return (
    <div className='select-box'>
      <Autocomplete
        disablePortal
        id='category-root'
        // value={rootValue}
        onChange={(event, newValue) => {
          // setRootValue(newValue)
          setValue('categoryId', newValue.category.categoryId)
        }}
        options={categories}
        getOptionLabel={(option) => option?.category?.categoryName}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              shrink: true,
            }}
            label='Suggested Category'
            margin='normal'
            required
          />
        )}
        renderOption={(props, option, state) => {
          return (
            <li {...props}>
              <div style={{ fontSize: '14px' }}>
                {option?.category?.categoryName}
                {option?.categoryTreeNodeAncestors.map((item) => (
                  <span key={item?.categoryTreeNodeLevel}>
                    {' > '}
                    {item?.categoryName}
                  </span>
                ))}
              </div>
            </li>
          )
        }}
        sx={{ width: '100%' }}
      />
      {/* <Autocomplete
        disablePortal
        id='category-root'
        // value={rootValue}
        onChange={(event, newValue) => {
          setRootValue(newValue)
          setValue('categoryId', newValue.categoryId)
        }}
        options={categories.map((item) => item.category)}
        getOptionLabel={(option) => option.categoryName}
        filterOptions={filterOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              shrink: true,
            }}
            label='Suggested Category'
            margin='normal'
            required
          />
        )}
        // renderOption={(props, option, { inputValue }) => {
        //   const matches = match(option.title, inputValue);
        //   const parts = parse(option.title, matches);

        //   return (
        //     <li {...props}>
        //       <div>
        //         {parts.map((part, index) => (
        //           <span
        //             key={index}
        //             style={{
        //               fontWeight: part.highlight ? 700 : 400,
        //             }}
        //           >
        //             {part.text}
        //           </span>
        //         ))}
        //       </div>
        //     </li>
        //   );
        // }}
        sx={{ width: '100%' }}
        classes={
          subCategories.length > 0 && {
            root: 'select-check',
          }
        }
      />
      {subCategories.length > 0 && (
        <Autocomplete
          disablePortal
          id='category-sub'
          // value={rootValue}
          // onChange={(event, newValue) => {
          //   setValue('categoryId', newValue.categoryId);
          // }}
          options={subCategories}
          getOptionLabel={(option) => option.categoryName}
          filterOptions={filterOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: true,
              }}
              label='Root Category'
              margin='normal'
              // required
            />
          )}
          sx={{ width: '90%' }}
          classes={
            subCategories.length > 0 && {
              root: 'select-sub',
            }
          }
        />
      )} */}
    </div>
  )
}
