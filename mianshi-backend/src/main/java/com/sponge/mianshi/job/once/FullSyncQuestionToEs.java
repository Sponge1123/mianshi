package com.sponge.mianshi.job.once;

import cn.hutool.core.collection.CollUtil;
import com.sponge.mianshi.esdao.PostEsDao;
import com.sponge.mianshi.esdao.QuestionEsDao;
import com.sponge.mianshi.model.dto.post.PostEsDTO;
import com.sponge.mianshi.model.dto.question.QuestionEsDTO;
import com.sponge.mianshi.model.entity.Post;
import com.sponge.mianshi.model.entity.Question;
import com.sponge.mianshi.service.PostService;
import com.sponge.mianshi.service.QuestionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 全量同步题目到 es
 *

 */
// todo 取消注释开启任务
@Component
@Slf4j
public class FullSyncQuestionToEs implements CommandLineRunner {

    @Resource
    private QuestionService questionService;

    @Resource
    private QuestionEsDao questionEsDao;

    @Override
    public void run(String... args) {
        List<Question> questionList = questionService.list();
        if (CollUtil.isEmpty(questionList)) {
            return;
        }
        List<QuestionEsDTO> questionEsDTOList = questionList.stream().map(QuestionEsDTO::objToDto).collect(Collectors.toList());
        final int pageSize = 500;
        int total = questionEsDTOList.size();
        log.info("FullSyncPostToEs start, total {}", total);
        for (int i = 0; i < total; i += pageSize) {
            int end = Math.min(i + pageSize, total);
            log.info("sync from {} to {}", i, end);
            questionEsDao.saveAll(questionEsDTOList.subList(i, end));
        }
        log.info("FullSyncPostToEs end, total {}", total);
    }
}
