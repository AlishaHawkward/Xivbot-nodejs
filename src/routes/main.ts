import express from 'express'
import Bot from '../models/bot'

import config from '../configs/config'

const router = express.Router()

// Main page
router.get('/', (req, res) => {
  res.render('index')
})

// Help page
router.get('/help', (req, res) => {
  res.render('help')
})

// Adopt a bot
router.post('/adopt', (req, res) => {
  let user_id = parseInt(req.body.user_id)
  let token = req.body.token
  let use_private = req.body.use_private || true
  let use_group = req.body.use_group || true
  if (!user_id || isNaN(user_id) || (isNaN(user_id) && user_id === 0)) {
    res.send(JSON.stringify({
      code: 1,
      msg: '月華用QQ号类型有误，请再次检查'
    }))
  } else if (user_id < 10000 || user_id > 9999999999) {
    res.send(JSON.stringify({
      code: 2,
      msg: '您输入的月華用QQ号有误，请确定在[10000, 9999999999]范围内'
    }))
  } else if (!token || token.length < 6 || token.length > 32) {
    res.send(JSON.stringify({
      code: 3,
      msg: '您输入的令牌长度有误，请确定长度在[6, 32]范围内'
    }))
  } else {
    Bot.findOne({ user_id }, (err, doc) => {
      if (err) {
        res.send(JSON.stringify({
          code: -1,
          msg: err
        }))
      } else {
        if (doc) {
          res.send(JSON.stringify({
            code: 4,
            msg: '您已经领养过了'
          }))
        } else {
          Bot.create({
            user_id, token, use_private, use_group
          }).then(() => {
            res.send(JSON.stringify({
              code: 0
            }))
          }).catch((err) => {
            res.send(JSON.stringify({
              code: -1,
              msg: err
            }))
          })
        }
      }
    })
  }

  // if (req.body.user_id.length >= 5) {
    // Bot.findOne({ user_id: req.body.user_id }, (err, doc) => {
    //   if (doc)
    //     res.send(JSON.stringify({
    //       code: 1,
    //       msg: '领养失败，您已经领养过了'
    //     }))
    //   else {
    //     if (req.body.use_private === 'on')
    //       req.body.use_private = true
    //     else
    //       req.body.use_private = false
    //     if (req.body.use_group === 'on')
    //       req.body.use_group = true
    //     else
    //       req.body.use_group = false
    //     Bot.create({
    //       user_id: req.body.user_id,
    //       token: req.body.token,
    //       use_private: req.body.use_private,
    //       use_group: req.body.use_group
    //     })
    //     res.send(JSON.stringify({
    //       code: 0,
    //       msg: '领养成功'
    //     }))
    //   }
    // })
  // } else {
  //   res.send(JSON.stringify({
  //     code: 2,
  //     msg: '请确认您月華用QQ号输入正确！'
  //   }))
  // }
})

// Get adopt list
router.post('/adopt_list', (req, res) => {
  Bot.find((err, bots) => {
    if (err) {
      console.log('[Error]', err)
      bots = []
    }
    res.send(JSON.stringify({
      bots,
      count: bots.length
    }))
  })
})

// Get Yuer Setting
router.post('/fetch_config', (req, res) => {
  let user_id = parseInt(req.body.user_id)
  let token = req.body.token
  if (!user_id || isNaN(user_id) || (isNaN(user_id) && user_id === 0) || user_id < 10000 || user_id > 9999999999) {
    res.send(JSON.stringify({
      code: 1,
      msg: '无法获取到月華的QQ号，请刷新页面重新尝试'
    }))
  } else if (!token || token.length < 6 || token.length > 32) {
    res.send(JSON.stringify({
      code: 2,
      msg: '您输入的令牌长度有误，请确定长度在[6, 32]范围内'
    }))
  } else {
    Bot.findOne({
      user_id, token
    }, (err, doc) => {
      if (err) {
        res.send(JSON.stringify({
          code: -1,
          msg: err
        }))
      } else {
        if (!doc) {
          res.send(JSON.stringify({
            code: 3,
            msg: '您指定的月華不存在或者令牌错误'
          }))
        } else {
          res.send(JSON.stringify({
            code: 0,
            config: doc
          }))
        }
      }
    })
  }
})

router.post('/edit_config', (req, res) => {
  let user_id = parseInt(req.body.user_id)
  let token = req.body.token
  let use_private = req.body.use_private || true
  let use_group = req.body.use_group || true
  let allow_groups = req.body.allow_groups.replace(/ /g, '').split(',') || []
  let ban_groups = req.body.ban_groups.replace(/ /g, '').split(',') || []
  let use_tata = req.body.use_tata || true
  let tata_url = req.body.tata_url || ''
  let tata_access = req.body.tata_access || ''
  if (!user_id || isNaN(user_id) || (isNaN(user_id) && user_id === 0)) {
    res.send(JSON.stringify({
      code: 1,
      msg: '月華用QQ号类型有误，请再次检查'
    }))
  } else if (user_id < 10000 || user_id > 9999999999) {
    res.send(JSON.stringify({
      code: 2,
      msg: '您输入的月華用QQ号有误，请确定在[10000, 9999999999]范围内'
    }))
  } else if (!token || token.length < 6 || token.length > 32) {
    res.send(JSON.stringify({
      code: 3,
      msg: '您输入的令牌长度有误，请确定长度在[6, 32]范围内'
    }))
  } else if (!token || token.length < 6 || token.length > 32) {
    res.send(JSON.stringify({
      code: 3,
      msg: '您输入的令牌长度有误，请确定长度在[6, 32]范围内'
    }))
  } else {
    Bot.findOne({
      user_id, token
    }, (err, doc) => {
      if (err) {
        res.send(JSON.stringify({
          code: -1,
          msg: err
        }))
      } else {
        if (!doc) {
          res.send(JSON.stringify({
            code: 4,
            msg: '您指定的月華不存在或者令牌错误'
          }))
        } else {
          Bot.updateOne({ user_id, token }, {
            use_private, use_group, allow_groups, ban_groups, use_tata, tata_url, tata_access
          }, (err) => {
            if (err) {
              res.send(JSON.stringify({
                code: 5,
                msg: '月華这边出现了一点错误，请重新尝试'
              }))
            } else {
              res.send(JSON.stringify({
                code: 0
              }))
            }
          })
        }
      }
    })
  }
})

// Request config
router.post('/download_config', (req, res) => {
  let user_id = parseInt(req.body.user_id)
  let token = req.body.token
  if (!user_id || isNaN(user_id) || (isNaN(user_id) && user_id === 0) || user_id < 10000 || user_id > 9999999999) {
    res.send(JSON.stringify({
      code: 1,
      msg: '无法获取到月華的QQ号，请刷新页面重新尝试'
    }))
  } else if (!token || token.length < 6 || token.length > 32) {
    res.send(JSON.stringify({
      code: 2,
      msg: '您输入的令牌长度有误，请确定长度在[6, 32]范围内'
    }))
  } else {
    Bot.findOne({
      user_id, token
    }, (err, doc) => {
      if (err) {
        res.send(JSON.stringify({
          code: -1,
          msg: err
        }))
      } else {
        if (!doc) {
          res.send(JSON.stringify({
            code: 3,
            msg: '您指定的月華不存在或者令牌错误'
          }))
        } else {
          res.send(JSON.stringify({
            code: 0,
            config: {
              host: "[::]",
              port: 5700,
              use_http: false,
              ws_host: "[::]",
              ws_port: 6700,
              use_ws: false,
              ws_reverse_url: "ws://" + config.host + ":" + config.ws_port,
              ws_reverse_use_universal_client: true,
              enable_heartbeat: true,
              use_ws_reverse: "yes",
              ws_reverse_reconnect_interval: 3000,
              ws_reverse_reconnect_on_code_1000: "yes",
              post_url: "",
              access_token: "",
              secret: "",
              post_message_format: "string",
              serve_data_files: false,
              update_source: "china",
              update_channel: "stable",
              auto_check_update: false,
              auto_perform_update: false,
              show_log_console: false,
              log_level: "info"
            }
          }))
        }
      }
    })
  }
})

module.exports = router