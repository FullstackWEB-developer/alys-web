// Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import moment from 'moment'

import { Pagination, PaginationItem } from '@mui/material';

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import { showMessage } from 'setup/messageSlice';
import './style.css'
import GetMailCheckbox from './checkbox'
import InventoryModal from './modal'

// App imports
import params from 'setup/config/params'
import { SET_CHECK, SET_INIT } from 'modules/mail/api/actions/types'
import { list } from 'modules/mail/api/actions/query'
import { save, remove } from 'modules/mail/api/actions/mutation'
import { URL_WEB } from 'setup/config/env'

// import { Checkbox, Button, Alert, Modal, TextField } from '@mui/material'
// import CheckIcon from '@mui/icons-material/Check'
// import styled from '@emotion/styled'
// import { styled } from '@mui/system';

const brands = [
    'zara',
    'zalando',
    'marksandspencer',
    'ikea',
    'next',
    'wayfair',
    // 'nike',
    // 'asos',
]

// Component
const List = () => {
  const dispatch = useDispatch()
  // state
  const [isLoading, isLoadingToggle] = useState(false)
  const [mails, setMails] = useState([])
  const mailEmpty = { text: '' }
  const [mail, setMail] = useState(mailEmpty)
  // const [checked, setChecked] = useState([])
  const [onModal, setOnModal] = useState({
    isOpen: false,
    isLoading: false,
    isError: false,
    data: null,
  })
  console.log("🚀 ~ file: index.js ~ line 165 ~ List ~ onModal", onModal)
  const checked = useSelector((state) => state.mail.check)
  // console.log('🚀 ~ file: index.js ~ line 67 ~ List ~ checked', checked)

  // const [page, setPage] = useState(1);
  // const handleChange = (event, value) => {
  //   setPage(value);
  // };

  // on load
  useEffect(() => {
    refresh()
    return () => dispatch({ type: SET_INIT })
  }, [])

  useEffect(() => {
    if (checked.length === 0) setMails([
    //   {brand: 'product.brand',
    //   productName: 'product.productName',
    //   color: 'product.color',
    //   size: 'product.size',
    //   orderDate: 'product.orderDate',
    //   mailId: 1,
    //   price: 'product.price',
    //   img: 'product.img',
    //   category: 'categoryList[i]',
    // }, {
    //   mailId: 2,
    //   brand: 'product.brand2',
    //   productName: 'product.productName2',
    //   color: 'product.color2',
    //   size: 'product.size2',
    //   orderDate: 'product.orderDate2',
    //   price: 'product.price2',
    //   img: 'product.img2',
    //   category: 'categoryList[i]2',}
    ])
  }, [checked])

  // refresh
  const refresh = async () => {
    isLoadingToggle(true)

    try {
      const { data } = await list()

      if (data.success && data.data) {
        setMails(data.data)
      } else {
        setMails([])
        dispatch(
          showMessage({
            message: `There is no Order!`,
            variant: 'error',
          })
        );
      }
    } catch (error) {
      console.log(error)
      dispatch(
        showMessage({
          message: error.message,
          autoHideDuration: 2000,
          variant: 'error',
        })
      );
    } finally {
      isLoadingToggle(false)
    }
  }

  // // on change
  // const onChange = (event) => {
  //   const { name, value } = event.target
  //   setMail({ ...mail, [name]: value })
  // }

  // // on remove
  // const onRemove = (mailId) => async () => {
  //   let check = window.confirm('Are you sure you want to delete this mail?')

  //   if (check) {
  //     try {
  //       const { data } = await remove({ mailId })

  //       if (data.success) {
  //         await refresh()
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }

  // on listSelect
  const onListSelect = (mailData) => {
  console.log("🚀 ~ file: index.js ~ line 257 ~ onListSelect ~ mailData", mailData)
    // let check = window.confirm('Are you sure you want to delete this mail?')

    setOnModal({
      isOpen: true,
      isLoading: false,
      isError: false,
      data: mailData,
    })
    // try {
    //   const { data } = await listSelect({ mailData })

    //   if (data.success) {
    //     await refresh()
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const handleModalClose = () => {
    setOnModal({
      isOpen: false,
      isLoading: false,
      isError: false,
      data: null,
    })
  }
  // render
  return (
    <>
      {/* meta */}
      <Helmet>
        <title>{`Mails · ${params.site.name}`}</title>
      </Helmet>

      {/* content */}
      <section className='mail-list'>
        {/* <form onSubmit={onSubmit}>
          <Input
            name='text'
            value={mail.text}
            placeholder='Enter mail'
            onChange={onChange}
            required
            autoFocus
          />

          <div>
            <Button title='Save' type='submit' />
          </div>
        </form> */}

        <div className='mail-list-header'>
          {brands.map((brand) => {
            return (
              <div className='mail-list-header-item' key={brand}>
                <GetMailCheckbox
                  brand={brand}
                  isChecked={checked}
                  // setChecked={setChecked}
                  isLoading={isLoading}
                  isLoadingToggle={isLoadingToggle}
                  setMails={setMails}
                />
              </div>
            )
          })}
        </div>

        <aside>
          <h4>
            Your orders:{' '}
            {isLoading && (
              <img
                src={`${URL_WEB}/images/loader.gif`}
                alt='loading...'
                height={14}
              />
            )}
          </h4>
          <table>
            <tr>
              <th>#</th>
              <th>BRAND</th>
              <th>PRODUCT NAME</th>
              {/* <th>CATEGORY</th> */}
              <th>COLOUR</th>
              <th>SIZE</th>
              <th>DATE PURCHASED</th>
              <th>PRICE</th>
              <th>SPECIFICATIONS TBC</th>
              <th>Image</th>
            </tr>
            {(mails.length === 0 || isLoading) ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center' }}>
                  {isLoading ? (
                    <img
                      src={`${URL_WEB}/images/loader.gif`}
                      alt='loading...'
                      height={24}
                    />
                  ) : 'You have not added any mails.'}
                </td>
              </tr>
            ) : (
              mails.map((mail, i) => {
                return (
                  <tr key={i} tabIndex={i + 1}
                    aria-hidden="true" role="button" style={{ cursor: "pointer" }} onClick={() => onListSelect(mail)}>
                    <td>{i + 1}</td>
                    <td>{mail.brand}</td>
                    <td>{mail.productName}</td>
                    {/* <td>{mail.category}</td> */}
                    <td>{mail.color}</td>
                    <td>{mail.size}</td>
                    <td>{moment(new Date(mail.orderDate)).format('yyyy/MM/DD')}</td>
                    <td>{mail.price}</td>
                    <td></td>
                    <td>
                      <img src={mail.img} alt={mail.name} height={50} />
                    </td>
                  </tr>
                )
              })
            )}
          </table>
          {/* <Pagination
            // classes={{ root: '', ul: 'rounded-8 bg-white p-10' }}
            // className="my-3"
            sx={{}}
            count={pageCount}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            shape="rounded"
            onChange={handleChange}
            renderItem={(item) => <PaginationItem {...item} />}
          /> */}
          {/* <div className='list'>
            {mails.length === 0 ? (
              <p>You have not added any mails.</p>
            ) : (
              mails.map((n) => (
                <div className='item' key={n._id}>
                  <p>{n.text}</p>

                  <p className='info'>
                    <em>{moment(n.createdAt).format(params.common.date)}</em>
                    {' · '}
                    <span onClick={onRemove(n._id)}>Delete</span>
                  </p>
                </div>
              ))
            )}
          </div> */}
        </aside>
      </section>
      {/* new MUI modal for mailData */}
      <InventoryModal onModal={onModal} handleModalClose={handleModalClose} />
    </>
  )
}

export default List
