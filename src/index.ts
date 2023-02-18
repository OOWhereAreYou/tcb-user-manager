import CloudBase from "@cloudbase/manager-node";
import { EndUserInfo } from "@cloudbase/manager-node/types/interfaces";

interface IUpdateStatus {
  code?: number;
  msg?: string;
  err?: any;
}

class CloudUser {
  // 单例
  private static cloudUser: CloudUser;
  /**
   * init 初始化 为单例
   * @static
   * @param {EnvId} envId
   * @returns {CloudUser}
   * @memberof CloudUser
   */
  public static init({
    envId,
    app,
  }: {
    envId?: string;
    app?: CloudBase;
  }): CloudUser {
    if (!CloudUser.cloudUser && !envId && !app) {
      throw new Error("envId is required or app is required");
    }
    if (!CloudUser.cloudUser && envId) {
      CloudUser.cloudUser = new CloudUser({ envId });
    }
    if (!CloudUser.cloudUser && app) {
      CloudUser.cloudUser = new CloudUser({ app });
    }
    return CloudUser.cloudUser;
  }

  // cloudBase
  private cloudBase: CloudBase;

  /**
   * Creates an instance of CloudUser.
   * @param {EnvId} envId
   * @memberof CloudUser
   * @private
   * @constructor
   * @description 私有构造函数，防止外部实例化
   */
  private constructor({ envId, app }: { envId?: string; app?: CloudBase }) {
    if (!envId && !app) {
      throw new Error("envId is required or app is required");
    }
    if (!app) {
      this.cloudBase = new CloudBase({
        envId: envId,
      });
    } else {
      this.cloudBase = app;
    }
  }

  /**
   * @description 创建用户
   * @param {string} username
   * @param {string} password
   * @returns {Promise<User>}
   * @memberof CloudUser
   * @public
   * @async
   * @function
   * @name registerUser
   */
  public async registerUser(
    username: string,
    password: string
  ): Promise<EndUserInfo | undefined> {
    try {
      const { User } = await this.cloudBase.user.createEndUser({
        username: username,
        password: password,
      });
      return User;
    } catch (error) {
      console.log(">>> 新建用户失败:", error);
    }
  }

  /**
   * @description 修改用户名
   * @param {string} uuid
   * @param {string} username
   * @returns {Promise<IUpdateStatus>}
   * @memberof CloudUser
   * @public
   * @async
   * @function
   * @name updateUsername
   */
  public async updateUsername(
    uuid: string,
    username: string
  ): Promise<IUpdateStatus> {
    try {
      await this.cloudBase.user.modifyEndUser({
        uuid: uuid,
        username: username,
      });
      return {
        code: 200,
        msg: "修改成功",
      };
    } catch (error) {
      console.log(">>> 修改用户名失败:", error);
      return {
        code: 500,
        msg: "修改失败",
        err: error,
      };
    }
  }

  /**
   * @description 修改密码
   * @param {string} uuid
   * @param {string} password
   * @returns {Promise<IUpdateStatus>}
   * @memberof CloudUser
   * @public
   * @async
   * @function
   * @name updatePassword
   */
  public async updatePassword(
    uuid: string,
    password: string
  ): Promise<IUpdateStatus> {
    try {
      await this.cloudBase.user.modifyEndUser({
        uuid: uuid,
        password: password,
      });
      return {
        code: 200,
        msg: "修改成功",
      };
    } catch (error) {
      console.log(">>> 修改密码失败:", error);
      return {
        code: 500,
        msg: "修改失败",
        err: error,
      };
    }
  }
}
export = CloudUser;
