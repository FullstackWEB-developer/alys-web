// Imports
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import moment from 'moment'

// UI imports
// import Button from 'ui/Button'
// import Input from 'ui/Input'
import './style.css'

// App imports
import params from 'setup/config/params'
import { SET_CHECK } from 'modules/mail/api/actions/types'
import { list } from 'modules/mail/api/actions/query'
import { save, remove } from 'modules/mail/api/actions/mutation'
import { URL_WEB } from 'setup/config/env'

import { Checkbox, Button } from '@mui/material'
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
  { name: 'zara', value: 'noreply@zara.com' },
  // { name: 'nike', value: 'nike.com' },
  { name: 'zalando', value: 'nfo@service-mail.zalando.co.uk' },
  { name: 'marksandspencer', value: 'email@service.marksandspencer.com' },
  { name: 'ikea', value: 'do-not-reply@ikea.com' },
  { name: 'next', value: 'DoNotReply@next.co.uk' },
  // { name: 'asos', value: 'no-reply@reviews.asos.com' },
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
      }
    } catch (error) {
      console.log(error)
    } finally {
      isLoadingToggle(false)
    }
  }

  return (
    <Checkbox
      disableRipple
      sx={{p:0, m:'10px'}}
      checked={isChecked.findIndex((element) => element.name === brand.name) > -1}
      disabled={isLoading}
      onChange={(e) => {
        if (isChecked.findIndex((element) => element.name === brand.name) > -1) {
          isLoadingToggle(true)
          for (var i = 0; i < isChecked.length; i++) {
            if (isChecked[i].name === brand.name) {
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
          {brand.name}
        </UnSelectedButton>
      }
      checkedIcon={
        <SelectedButton
          variant='contained'
          color='primary'
          startIcon={<CheckIcon />}
        >
          {brand.name}
        </SelectedButton>
      }
    />
  )
}

// Component
const List = () => {
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
      }
    } catch (error) {
      console.log(error)
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
              <div className='mail-list-header-item' key={brand.id}>
                <GetMailCheckbox
                  brand={brand}
                  // value={brand.value}
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
                <td colSpan={9} style={{ textAlign: 'center' }}>
                  You have not added any mails.
                </td>
              </tr>
            ) : (
              mails.map((mail, i) => {
                return (
                  <tr key={i}>
                    <td>{mail.brand}</td>
                    <td>{mail.productName}</td>
                    <td>{mail.category}</td>
                    <td>{mail.color}</td>
                    <td>{mail.size}</td>
                    <td>{mail.orderDate}</td>
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
