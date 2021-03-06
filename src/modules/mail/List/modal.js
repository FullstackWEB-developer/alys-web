import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import NumberFormat from 'react-number-format';
import axios from 'axios'
// import Ebay from 'ebay-node-api'

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import { showMessage } from 'setup/messageSlice'
// import { ebayAuthToken, scopes } from 'setup/oauth/ebay'
import './style.css'

import { Checkbox, Button, Alert, Modal, TextField, TextareaAutosize, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
// import TextareaAutosize from '@mui/base/TextareaAutosize';

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

import { authorize } from 'modules/user/api/loginSlice'
// import { getAuthToken } from 'modules/marketplace/api/list'
import { URL_API } from 'setup/config/env'
import marketplaceSave from 'modules/marketplace/api/mutation/save'

const user = JSON.parse(window.localStorage.getItem('user'))

const defaultValues = {
  SKU: '',
  brand: '',
  productName: '',
  color: '',
  size: '',
  orderDate: '',
  price: '',
  img: '',
  description: ''
}

const conditions = [
  { name: 'New', value: 'NEW' },
  { name: 'Like new', value: 'LIKE_NEW' },
  // { name: 'New with defects', value: 'NEW_WITH_DEFECTS'},
  { name: 'Used excellent', value: 'USED_EXCELLENT' },
  { name: 'Used good', value: 'USED_GOOD' },
  { name: 'Used acceptable', value: 'USED_ACCEPTABLE' },
]
export function PoundNumberFormat(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      // decimalSeparator=","
      // thousandSeparator="."
      fixedDecimalScale
      decimalScale={2}
      min={0}
      isNumericString
      // prefix="$"
      suffix="??"
    />
  );
}

export default function InventoryModal({
  onModal,
  // setOnModal,
  handleModalClose,
}) {
  const dispatch = useDispatch()
  // const [change, setChange] = useState('')

  /**
   * Form Validation Schema
   */
  // const schema = yup.object().shape({
  //   note: yup.string().required('You must enter a Cognome'),
  // })

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm({
    mode: 'onChange',
    defaultValues,
    // resolver: yupResolver(schema),
  })
  console.log('???? ~ file: modal.js ~ line 52 ~ getValues', getValues())

  const { isValid, dirtyFields, errors } = formState

  const initData = useCallback(() => {
    reset({
      ...defaultValues,
      ...onModal.data,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onModal.data])

  // on load
  useEffect(() => {
    initData();
    return () =>
      initData(
        reset({
          ...defaultValues,
        }),
      )
  }, [onModal.isOpen])

  /**
   * Form Submit
   */
  async function onSubmit(submitData) {
    console.log('???? ~ file: modal.js ~ line 40 ~ onSubmit ~ data', submitData)
    // isLoadingToggle(true)

    const SellInventoryItem = {
      availability: {
        shipToLocationAvailability: {
          quantity: submitData.quantity,
        }
      },
      condition: submitData.condition,
      product: {
        title: submitData.productName,
        description: submitData.description,
        aspects: {
          "color": [
            submitData.color
          ],
          // "Type": [
          //   "Helmet/Action"
          // ],
          // "Storage Type": [
          //   "Removable"
          // ],
          // "Recording Definition": [
          //   "High Definition"
          // ],
          // "Media Format": [
          //   "Flash Drive (SSD)"
          // ],
          // "Optical Zoom": [
          //   "10x"
          // ]
        },
        brand: submitData.brand,
        imageUrls: [submitData.img],
      }
    }
    const EbayOfferDetailsWithId = {
      // availableQuantity: 75,
      // categoryId: '30120',
      // listingDescription:
      //   'Lumia phone with a stunning 5.7 inch Quad HD display and a powerful octa-core processor.',

      // listingPolicies: {
      //   fulfillmentPolicyId: '<fulfillmentPolicyId>',
      //   paymentPolicyId: '<paymentPolicyId>',
      //   returnPolicyId: '<returnPolicyId>',
      // },
      // merchantLocationKey: 'string',
      pricingSummary: {
        price: {
          currency: 'GBP',
          value: submitData.price,
        },
      },
        // quantityLimitPerBuyer: 2,
        // includeCatalogProductDetails: true,
    };
    try {
      const res = await marketplaceSave({ sku: submitData.SKU, body: { SellInventoryItem, EbayOfferDetailsWithId } })

      if (res.data.success) {
        dispatch(showMessage({
          variant: 'success',
          message: res.data.message,
        }))
        handleModalClose()
      } else {
        dispatch(showMessage({
          variant: 'error',
          message: res.data.message,
        }))
      }
    } catch (error) {
      dispatch(
        showMessage({
          message: error.message,
          autoHideDuration: 3000,
          variant: 'error',
        })
      );
    }
  }

  return (
    <Dialog open={onModal.isOpen} onClose={handleModalClose}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '500px' }}>
        <DialogTitle className='list-modal-title'>InventoryModal</DialogTitle>
        {/* <p className="text-grey-600 text-12 mt-3">Compila le informazioni sulla nuova campagna</p> */}
        <DialogContent>
          <div className='list-modal-container'>
            {/* <Controller
              name='brand'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
          InputLabelProps={{
            shrink: true,
          }}
                  type='text'
                  sx={{ width: '200px', marginY: '20px' }}
                  label='BRAND'
                // onChange={(e) => onChange(e.target.value)}
                />
              )}
            /> */}
            <Controller
              name='productName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type='text'
                  sx={{ width: '100%', marginY: '20px' }}
                  label='Title'
                  required
                />
              )}
            />
            <p style={{ marginBottom: '5px' }}>Description *</p>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  sx={{ width: '100%', marginY: '20px' }}
                  // className="w-full h-156 border-2 rounded-8 p-12 border-grey-C7CD font-semibold"
                  id="description"
                  minRows={7}
                  
                  required
                />
              )}
            />
            {/* TODO: category */}


            <div className='list-modal-row'>
              <Controller
                name='color'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: '130px' }}
                    label='Colour'
                  />
                )}
              />
              <Controller
                name='quantity'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type='number'
                    sx={{ width: '130px' }}
                    label='Quantity'
                    required
                  />
                )}
              />
              <Controller
                name='SKU'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: '130px' }}
                    label='SKU'
                    required
                  // placeholder='DESCRIPTION'
                  // onChange={(e) => onChange(e.target.value)}
                  />
                )}
              />
            </div>

            <div className='list-modal-row'>
              <Controller
                name='price'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}

                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: '130px' }}
                    label='Sale Price'
                    InputProps={{
                      inputComponent: PoundNumberFormat,
                    }}
                    required
                  />
                )}
              />
              <Controller
                name='condition'
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <InputLabel shrink={true} id="condition-label" sx={{backgroundColor: 'white'}}>Condition</InputLabel>
                    <Select
                      {...field}
                      labelId="condition-label"
                      id="condition"
                      sx={{ width: '290px' }}
                      required
                    // input={<BootstrapInput />}
                    // IconComponent={ExpandMoreRoundedIcon}
                    >
                      {conditions.map((condition) => (
                        <MenuItem key={condition.value} value={condition.value}>
                          {condition.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions className='justify-between p-4 pb-4'>
          <Button
            variant='outlined'
            color='inherit'
            className='m-20 w-max text-grey'
            onClick={handleModalClose}
          >
            CANCEL
          </Button>
          <Button
            variant='outlined'
            type='submit'
            color='primary'
            className='m-20 px-44 w-max hover:bg-agent'
          >
            SUBMIT
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
