// Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import moment from 'moment'

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import { showMessage } from 'setup/messageSlice';
import './style.css'

// App imports
import params from 'setup/config/params'
import { SET_CHECK, SET_INIT } from 'modules/mail/api/actions/types'
import { list } from 'modules/mail/api/actions/query'
import { save, remove } from 'modules/mail/api/actions/mutation'
import { URL_WEB } from 'setup/config/env'

import { Checkbox, Button, Alert } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import styled from '@emotion/styled'
// import { styled } from '@mui/system';

const UnSelectedButton = styled(Button)`
  background: #e3e9ee;
  color: #34a196;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  height: 44px;
  border-radius: 100px;
`

const SelectedButton = styled(Button)`
  background: #34a196;
  color: white;
  font-size: 16px;
  font-weight: 700;
  padding: 10px 20px;
  height: 44px;
  border-radius: 100px;
`

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

const GetMailCheckbox = ({
  // name,
  // value,
  brand,
  isChecked,
  // setChecked,
  isLoading,
  isLoadingToggle,
  setMails,
}) => {
  const dispatch = useDispatch()
  // const [isChecked, setIsChecked] = useState(false);
  // console.log("🚀 ~ file: index.js ~ line 66 ~ isChecked", isChecked)

  const handleChange = async (params) => {
    isLoadingToggle(true)
    try {
      const { data } = await list(params)

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

  return (
    <Checkbox
      disableRipple
      sx={{ p: 0, m: '10px' }}
      checked={isChecked.findIndex((element) => element === brand) > -1}
      disabled={isLoading}
      onChange={(e) => {
        if (isChecked.findIndex((element) => element === brand) > -1) {
          isLoadingToggle(true)
          for (var i = 0; i < isChecked.length; i++) {
            if (isChecked[i] === brand) {
              isChecked.splice(i, 1)
              handleChange(isChecked).then(() => {
                dispatch({
                  type: SET_CHECK,
                  payload: isChecked
                })
                isLoadingToggle(false)
              })
            }
          }
          // setIsChecked(false)
        } else {
          handleChange([...isChecked, brand]).then(() => {
            dispatch({
              type: SET_CHECK,
              payload: [...isChecked, brand]
            })
            // setIsChecked(true)
          })
        }
      }}
      icon={
        <UnSelectedButton variant='contained' color='primary'>
          {brand}
        </UnSelectedButton>
      }
      checkedIcon={
        <SelectedButton
          variant='contained'
          color='primary'
          startIcon={<CheckIcon />}
        >
          {brand}
        </SelectedButton>
      }
    />
  )
}

// Component
const List = () => {
  const dispatch = useDispatch()
  // state
  const [isLoading, isLoadingToggle] = useState(false)
  const [mails, setMails] = useState([])
  const mailEmpty = { text: '' }
  const [mail, setMail] = useState(mailEmpty)
  // const [checked, setChecked] = useState([])
  const checked = useSelector((state) => state.mail.check)
  // console.log('🚀 ~ file: index.js ~ line 67 ~ List ~ checked', checked)

  // on load
  useEffect(() => {
    refresh()
    return () => dispatch({ type: SET_INIT })
  }, [])

  useEffect(() => {
    if (checked.length === 0) setMails([])
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

  // on submit
  const onSubmit = async (event) => {
    event.preventDefault()

    isLoadingToggle(true)

    try {
      const { data } = await save(mail)

      if (data.success && data.data) {
        setMail(mailEmpty)

        await refresh()
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoadingToggle(false)
    }
  }

  // on change
  const onChange = (event) => {
    const { name, value } = event.target
    setMail({ ...mail, [name]: value })
  }

  // on remove
  const onRemove = (mailId) => async () => {
    let check = window.confirm('Are you sure you want to delete this mail?')

    if (check) {
      try {
        const { data } = await remove({ mailId })

        if (data.success) {
          await refresh()
        }
      } catch (error) {
        console.log(error)
      }
    }
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
              <th>CATEGORY</th>
              <th>COLOUR</th>
              <th>SIZE</th>
              <th>DATE PURCHASED</th>
              <th>PRICE</th>
              <th>SPECIFICATIONS TBC</th>
              <th>Image</th>
            </tr>
            {(mails.length === 0 || isLoading) ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center' }}>
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
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{mail.brand}</td>
                    <td>{mail.productName}</td>
                    <td>{mail.category}</td>
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
    </>
  )
}

export default List
