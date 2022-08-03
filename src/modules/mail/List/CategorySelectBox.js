// Imports
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { showMessage } from 'setup/messageSlice'
import { marketplaceCategory } from '../../marketplace/api/query'

export default function InventoryModal({ watch, setValue }) {
  const dispatch = useDispatch()
  // const [change, setChange] = useState('')
  const [categories, setCategories] = useState([])
  console.log(
    '🚀 ~ file: CategorySelectBox.js ~ line 14 ~ InventoryModal ~ categories',
    categories,
  )
  const [subCategories, setSubCategories] = useState([])
  const categoryId = watch('categoryId')
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

  const handleChange = (e) => {
    marketplaceCategory()
  }

  /**
   * Form Submit
   */

  return (
    <div className='select-box'>
      <Autocomplete
        disablePortal
        id='combo-box-demo'
        options={categories}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label='Movie' />}
      />
    </div>
  )

  // return (
  //   <div className='select-box'>
  //     <div className='selects-box select-box '>
  //       <label for='id_zipsale_category_id'>
  //         Category<sup className='required-star'>*</sup>
  //       </label>
  //       <button className='clear '>
  //         <img
  //           src='https://storage.googleapis.com/responsive-task-281907.appspot.com/static/dashboard/img/svg/close.689fc58d28fa.svg'
  //           alt=''
  //         />
  //         Clear
  //       </button>
  //       <div className='select-wrap' name='category_1'>
  //         <input
  //           name='zipsale_category_id'
  //           className='category-select'
  //           style={{display: 'none'}}
  //           data-api-root='https://cat.zipsale.co.uk/api/v1'
  //           data-api-token='8fe29850cd28d1e4226c109cb393c138064d8dc4'
  //           data-parents-data=''
  //           value=''
  //         />
  //         <div
  //           className={`choices ${'is-open is-fliped is-focused'}`}
  //           data-type='select-one'
  //           tabindex='0'
  //           aria-controls='combobox'
  //           aria-autocomplete='list'
  //           aria-haspopup='true'
  //           aria-expanded='true'
  //         >
  //           <div className='choices__inner'>
  //             <select
  //               name='category_1'
  //               className='js-choice choices__input'
  //               tabindex='-1'
  //               aria-hidden='true'
  //               hidden=''
  //               data-choice='active'
  //             >
  //               <option value='99660'>Art</option>
  //             </select>
  //             <div className='choices__list choices__list--single'>
  //               <div
  //                 className='choices__item choices__item--selectable'
  //                 data-item=''
  //                 data-id='3'
  //                 data-value=''
  //                 data-custom-properties='null'
  //                 aria-selected='true'
  //               >
  //                 ---------
  //               </div>
  //             </div>
  //           </div>
  //           <div
  //             className={`choices__list choices__list--dropdown ${'is-active'}`}
  //             aria-expanded='true'
  //           >
  //             <input
  //               type='text'
  //               className='choices__input choices__input--cloned'
  //               autocomplete='off'
  //               autocapitalize='off'
  //               spellcheck='false'
  //               aria-autocomplete='list'
  //               aria-label='Select primary category'
  //               placeholder=''
  //               aria-activedescendant='choices--category_1-9r-item-choice-3'
  //             />
  //             <div className='choices__list' role='listbox'>
  //               {categories.length > 0 && categories.map((item) => {
  //                 return (
  //                   <div
  //                     id='choices--category_1-9r-item-choice-22'
  //                     className='choices__item choices__item--choice choices__placeholder choices__item--disabled'
  //                     data-choice=''
  //                     data-id='22'
  //                     data-value=''
  //                     data-select-text='Press to select'
  //                     data-choice-disabled=''
  //                     aria-disabled='true'
  //                     onClick={() => setValue(item.category.categoryId)}
  //                   >
  //                     {item.category.categoryName}
  //                   </div>
  //                 )
  //               })}
  //               {/* <div id="choices--category_1-9r-item-choice-1"
  //                 className="choices__item choices__item--choice choices__item--selectable" role="option" data-choice=""
  //                 data-id="1" data-value="None" data-select-text="Press to select" data-choice-selectable="">---------</div>
  //               <div id="choices--category_1-9r-item-choice-2"
  //                 className="choices__item choices__item--choice choices__item--selectable" role="option" data-choice=""
  //                 data-id="2" data-value="99657" data-select-text="Press to select" data-choice-selectable="">Antiques</div>
  //               <div id="choices--category_1-9r-item-choice-3"
  //                 className="choices__item choices__item--choice is-selected choices__item--selectable is-highlighted"
  //                 role="option" data-choice="" data-id="3" data-value="99660" data-select-text="Press to select"
  //                 data-choice-selectable="" aria-selected="true">Art</div> */}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       {subCategories.length > 0 && (
  //         <div className='select-wrap subselect' name='category_2'>
  //           <div
  //             className='choices'
  //             data-type='select-one'
  //             tabindex='0'
  //             aria-controls='combobox'
  //             aria-autocomplete='list'
  //             aria-haspopup='true'
  //             aria-expanded='false'
  //           >
  //             <div className='choices__inner'>
  //               <select
  //                 name='category_2'
  //                 className='choices__input'
  //                 hidden=''
  //                 tabindex='-1'
  //                 data-choice='active'
  //               >
  //                 <option value='None'>---------</option>
  //               </select>
  //               <div className='choices__list choices__list--single'>
  //                 <div
  //                   className='choices__item choices__item--selectable'
  //                   data-item=''
  //                   data-id='1'
  //                   data-value='None'
  //                   data-custom-properties='null'
  //                   aria-selected='true'
  //                 >
  //                   ---------
  //                 </div>
  //               </div>
  //             </div>
  //             <div
  //               className='choices__list choices__list--dropdown'
  //               aria-expanded='false'
  //             >
  //               <input
  //                 type='text'
  //                 className='choices__input choices__input--cloned'
  //                 autocomplete='off'
  //                 autocapitalize='off'
  //                 spellcheck='false'
  //                 aria-autocomplete='list'
  //                 placeholder=''
  //               />
  //               <div className='choices__list' role='listbox'>
  //                 <div
  //                   id='choices--category_2-dj-item-choice-1'
  //                   className='choices__item choices__item--choice is-selected choices__item--selectable is-highlighted'
  //                   role='option'
  //                   data-choice=''
  //                   data-id='1'
  //                   data-value='None'
  //                   data-select-text='Press to select'
  //                   data-choice-selectable=''
  //                   aria-selected='true'
  //                 >
  //                   ---------
  //                 </div>
  //                 <div
  //                   id='choices--category_2-dj-item-choice-2'
  //                   className='choices__item choices__item--choice choices__item--selectable'
  //                   role='option'
  //                   data-choice=''
  //                   data-id='2'
  //                   data-value='99784'
  //                   data-select-text='Press to select'
  //                   data-choice-selectable=''
  //                 >
  //                   Art Drawings
  //                 </div>
  //                 <div
  //                   id='choices--category_2-dj-item-choice-3'
  //                   className='choices__item choices__item--choice choices__item--selectable'
  //                   role='option'
  //                   data-choice=''
  //                   data-id='3'
  //                   data-value='99785'
  //                   data-select-text='Press to select'
  //                   data-choice-selectable=''
  //                 >
  //                   Art Photographs
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // )
}
