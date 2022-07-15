import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// import Ebay from 'ebay-node-api'

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import { showMessage } from 'setup/messageSlice'
import './style.css'

import { Checkbox, Button, Alert, Modal, TextField } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'

const InventoryModal = ({
  onModal,
  // setOnModal,
  handleModalClose,
}) => {
  // const dispatch = useDispatch()
  // const [change, setChange] = useState('')

  const defaultValues = {
    mailId: null,
    brand: '',
    productName: '',
    color: '',
    size: '',
    orderDate: '',
    price: '',
    img: '',
    description: ''
  }

  /**
   * Form Validation Schema
   */
  const schema = yup.object().shape({
    note: yup.string().required('You must enter a Cognome'),
  })

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
    resolver: yupResolver(schema),
  })
  console.log('🚀 ~ file: modal.js ~ line 52 ~ getValues', getValues())

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
    initData()
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
  async function onSubmit(data) {
    console.log('🚀 ~ file: modal.js ~ line 40 ~ onSubmit ~ data', data)
    // isLoadingToggle(true)

    // try {
    //   const { data } = await save(mail)

    //   if (data.success && data.data) {
    //     setMail(mailEmpty)

    //     await refresh()
    //   }
    // } catch (error) {
    //   console.log(error)
    // } finally {
    //   isLoadingToggle(false)
    // }
  }

  return (
    <Dialog open={onModal.isOpen} onClose={handleModalClose}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '500px' }}>
        <DialogTitle className='list-modal-title'>InventoryModal</DialogTitle>
        {/* <p className="text-grey-600 text-12 mt-3">Compila le informazioni sulla nuova campagna</p> */}
        <DialogContent>
          <div className='list-modal-container'>
            {/* <FormControl fullWidth className="my-40">
              <InputLabel id="campaignType-label">Seleziona tipologia</InputLabel>
              <Select
                {...field}
                labelId="campaignType-label"
                id="campaignType"
                input={<BootstrapInput />}
                IconComponent={ExpandMoreRoundedIcon}
              >
                {['Sconto in abbinamento', 'Extra time']?.map((campaignType) => (
                  <MenuItem key={campaignType} value={campaignType}>
                    {campaignType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <Controller
              name='brand'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='text'
                  sx={{ width: '200px', marginY: '20px' }}
                  label='BRAND'
                // onChange={(e) => onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name='productName'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='text'
                  sx={{ width: '200px', marginY: '20px' }}
                  label='PRODUCT NAME'
                // onChange={(e) => onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '200px', marginY: '20px' }}
                  label='DESCRIPTION'
                // placeholder='DESCRIPTION'
                // onChange={(e) => onChange(e.target.value)}
                />
              )}
            />
            <Controller
              name='price'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '200px', marginY: '20px' }}
                  label='PRICE'
                // placeholder='DESCRIPTION'
                // onChange={(e) => onChange(e.target.value)}
                />
              )}
            />
            {/* <Controller
              name='color'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ width: '200px', marginY: '20px' }}
                  label='COLOUR'
                // placeholder='DESCRIPTION'
                // onChange={(e) => onChange(e.target.value)}
                />
              )}
            /> */}
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

export default InventoryModal
